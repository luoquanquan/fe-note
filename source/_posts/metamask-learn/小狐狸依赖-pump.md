---
title: 小狐狸依赖-pump
date: 2022-10-03 16:58:28
categories:
    - web3
tags:
    - metaMask
---

> pump is a small node module that pipes streams together and destroys all of them if one of them closes.

在 metamask 中各运行时的通信使用到了流(stream), 相对于 `postMessage` 的好处是处理大数据不会卡内存. 但是在 stream 中处理过程中由于没有握手和挥手的机智, 如果你的目标流关闭了这个状态是不会通知给数据源流. 数据源还会源源不断的写入数据, 但是没有目标流会获取这些数据了...

<!-- more -->

## stream 的使用

首先, 我们回顾一下 stream 的使用, 在任意一个目录创建 index.js 写下如下代码.

```js
// index.js
const fs = require('fs')

const readStream = fs.createReadStream('./index.js')
const writeStream = fs.createWriteStream('./dest')

setTimeout(() => {
    readStream.pipe(writeStream)
}, 1e3)
```

上述代码中, 我们创建了一个可读流 `readStream` 用于读取当前的 index.js 文件. 然后创建了一个可写流用于往 dest 文件中写入内容.

定时器 1s 后执行 `readStream.pipe(writeStream)` 将可读流的内容传递给可写流.

执行 `node index.js` 之后会发现目录中多了个 dest 文件, 文件内容和 `index.js` 一样.

示例代码在[这里](https://github.com/luoquanquan/learn-fe/tree/pump-v1/metamask-learn/pump-learn)

## 原生的流处理存在的问题

在刚刚的示例中, 我们定时 1s 后写入内容. 当 writeStream 流关闭或者完成的事件是不会通知给 readStream 的. 也就是说, 如果在调用 pipe 之前调用了 writeStream.destroy() 关闭可写流. 程序依然可以执行只是没有预期的效果. 气人的是, 连报错都没有...

当前步骤的示例代码在[这里](https://github.com/luoquanquan/learn-fe/tree/pump-v1.1/metamask-learn/pump-learn)

## 使用 pump 规范化流的处理流程

在项目中引入 pump 并包装可读流和可写流. 修改 index.js 的代码如下:

```js
const fs = require('fs')
const pump = require('pump')

const readStream = fs.createReadStream('./index.js')
const writeStream = fs.createWriteStream('./dest')

setTimeout(() => {
    // writeStream.destroy()

    pump(readStream, writeStream, err => {
        if (err) {
            console.log(err)
            console.log('发生错误, 写入失败 ~')
            return
        }

        console.log('写入完成')
    })
}, 1e3)
```

执行 node index.js 之后可以成功读取并写入文件. 但是如果在写入之前关闭可写流的话(放开 `// writeStream.destroy()` 的注释), 控制台会报出错误. 业务代码可以通过规范化的错误信息做出相应的处理.

当前步骤的代码在[这里](https://github.com/luoquanquan/learn-fe/tree/pump-v2/metamask-learn/pump-learn)

## 源码分析

```js
// https://www.npmjs.com/package/once
// Only call a function once.
var once = require('once')
// https://www.npmjs.com/package/end-of-stream
// A node module that calls a callback when a readable/writable/duplex stream has completed or failed.
var eos = require('end-of-stream')
var fs = require('fs') // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}

// https://nodejs.org/api/process.html#processversion
// ancient 古老的
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

// 是否为文件流
var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

// 是否是请求
var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

// 销毁流
var destroyer = function (stream, reading, writing, callback) {
  // 确保 callback 只会执行一次
  callback = once(callback)

  // 监听流的关闭事件
  var closed = false
  stream.on('close', function () {
    closed = true
  })

  // 监听流的结束事件
  eos(stream, {readable: reading, writable: writing}, function (err) {
    // 如果当前流完成或者出错了直接调用回调函数
    if (err) return callback(err)

    // 如果当前流非错误关闭修改关闭标识
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

// 管道
var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  // 参数处理
  var streams = Array.prototype.slice.call(arguments)
  // 默认认为最后一个参数为回调函数
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  // 兼容以数组的形式传入参数
  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    // 除了最后一个都是可读的流
    var reading = i < streams.length - 1

    // 除了第一个都是可写的流
    var writing = i > 0

    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      // 如果有一个流出错, 直接销毁所有的流
      if (err) destroys.forEach(call)
      // 除了最后一个流关闭都不处理
      if (reading) return
      // 如果最后一个流关闭 / 完成了那就关闭所有流
      destroys.forEach(call)
      // 并且执行回调函数通知业务层
      callback(error)
    })
  })

  // 这里和我们自己写 pipe 的方式一样
  return streams.reduce(pipe)
}

module.exports = pump
```

## node 原生已经支持了 😂

经过我叮咣一顿乱整, 对于 pump 这个模块算是搞明白了. 然后就看到了[这个文档](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback), `node v10.0.0` 新增的 api 已经原生实现了...

原生 api 使用方法:
```js
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.

// A pipeline to gzip a potentially huge tar file efficiently:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);
```

## 参考资料

- <https://github.com/mafintosh/pump>
- [pump中文文档](http://www.npmdoc.org/pumpzhongwenwendangpump-jszhongwenjiaochengjiexi.html)
- [stream.pipeline(streams, callback)](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback)
- [数据流中的积压问题](https://nodejs.org/zh-cn/docs/guides/backpressuring-in-streams/)
