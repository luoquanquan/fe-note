---
title: 小狐狸依赖-post-message-stream
date: 2022-09-26 11:23:10
categories:
    - web3
tags:
    - metaMask
---

> 阅读 metamask 的 package.json 的过程中, 第一个吸引我注意的 npm 包就是 post-message-stream. 无它, 唯眼熟尔.

## 首先想到 [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

> 一个窗口可以获得对另一个窗口的引用 (比如 targetWindow = window.opener), 然后在窗口上调用 targetWindow.postMessage() 方法分发一个 MessageEvent 消息. 接收消息的窗口可以根据需要自由处理此事件 (en-US). 传递给 window.postMessage() 的参数(比如 message)将通过消息事件对象暴露给接收消息的窗口

简单的说, 你首先打开一个页面 `index`, 然后在这个页面通过 `window.open()` 打开一个子页面, 此时就能通过 `postMessage` 实现两个父子页面之间的通信. `此外postMessage` 还常用于 `webWorker` 和主进程之间的通信.

<!-- more -->

### 举个 🌰

为了便于理解, 我搞了个测试项目用于, 笔记好记性不如烂笔头子.

首先, 你有一个 `index.html` 作为父级页面

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Index</title>
</head>
<body>
    <h1>Home Page</h1>
    <button id="btn-open-foo">open Foo</button>
    <button id="btn-hi-via-post-message">hi this is Home via post message</button>

    <script src="./index.js"></script>
</body>
</html>
```

父级页面中引入的 js 文件为
```js
import $ from 'jquery'

let fooPage

$('#btn-open-foo').on('click', () => {
    fooPage = window.open('/sub-html/foo.html')
})

$('#btn-hi-via-post-message').on('click', () => {
    if (fooPage) {
        fooPage.postMessage('hi this is Home Page', '*')
    }
})

window.addEventListener('message', ({data}) => {
    console.log(`Current timestamp ${Date.now()} data: `, data)
})
```

通过 js 中我们不难发现, 项目中还需要一个 `sub-html/foo.html`
```html
<!-- sub-html/foo.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Foo</title>
</head>
<body>
    <h1>Foo Page</h1>
    <button id="btn-send">hi this is Foo Page</button>

    <script src="./foo.js"></script>
</body>
</html>
```

在它的同级, 还需要一个 `foo.js` 文件
```js
import $ from 'jquery'

$('#btn-send').on('click', () => {
    window.opener.postMessage('hi this is Foo Page')
})

window.addEventListener('message', ({data}) => {
    console.log(`Current timestamp ${Date.now()} data: `, data)
})
```

以上为 postMessage 简单应用的实例, 代码过于简单, 不做逐行注释. 其中需要特殊说明的是在子页面中 `window.opener` 其实就是对打开这个子页面的父级页面的 `window` 引用, eg:

大头儿子.opener === 小头爸爸 => true

<small>PS: 仅作为技术实例, 不做真实性判断</small>

### 运行示例代码

上述示例代码均已上传 [github](https://github.com/luoquanquan/learn-fe/tree/post-message-stream-learn-v1/metamask-learn/post-message-stream-learn), 纸上得来终觉浅, 建议手敲一下. 20 来分钟就能搞定. 由于项目中用到了 npm 的 jQuery 包. 所以用 [parcel](https://zh.parceljs.org) 构建了一下, 直接 `npm start` 即可.

代码运行完成后浏览器访问 <http://localhost:1234/index.html> 即可打开 `Index Page`. postMessage 的工作过程如下图:

![](https://handle-note-img.niubishanshan.top/post-message.gif)

## 小狐狸依赖 post-message-stream@^4.0.0

> Sets up a duplex object stream over window.postMessage, between pages or a dedicated Web Worker and its parent window.

在 `post-message-stream@^4.0.0` 的官方描述中. 这个库的作用是创建一个用于跨页面或者父级页面和 Web Worker 通信的双工对象流. 在最新的版本中其实它还支持 `nodejs` 但是在 `metamask` 中其实只用到了 `^4.0.0` 这个版本. 因此这里按下不表.

### 举个 🌰



基于刚刚的 `postMessage` 示例进行改造, 首先安装依赖

- npm i @metamask/post-message-stream@^4.0.0

添加 `bar.html` 子页面
```html
<!-- sub-html/bar.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bar</title>
</head>
<body>
    <h1>Bar Page</h1>
    <button id="btn-send">hi this is Bar Page</button>

    <script src="./bar.js"></script>
</body>
</html>
```

创建 `bar.js`
```js
import $ from 'jquery'
import { WindowPostMessageStream } from '@metamask/post-message-stream'

// 注意这里的 name 和 target 和 index.js 中的两个同名字段是反过来的. 以此来实现两者的双向绑定
const barStream = new WindowPostMessageStream({
    name: 'barStream',
    target: 'indexStream',
    targetWindow: window.opener
})

barStream.on('data', data => {
    console.log(`${Date.now()} receive data via stream: `, data)
})

$('#btn-send').on('click', () => {
    barStream.write('hi this is Bar Page')
})
```
优化 indexPage

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Index</title>
</head>
<body>
    <h1>Home Page</h1>
    <button id="btn-open-foo">open Foo</button>
    <button id="btn-open-bar">open Bar</button>
    <button id="btn-hi-via-post-message">hi this is Home via post message</button>
    <button id="btn-hi-via-stream">hi this is Home via stream</button>

    <script src="./index.js"></script>
</body>
</html>
```

```js
import $ from 'jquery'
import { WindowPostMessageStream } from '@metamask/post-message-stream'

let fooPage
let barPage

const registerBarStream = () => {
    const indexStream = new WindowPostMessageStream({
        name: 'indexStream',
        target: 'barStream',
        targetWindow: barPage
    })

    indexStream.on('data', data => {
        console.log(`${Date.now()} receive data via stream: `, data)
    })
    indexStream.write('before -----')

    $('#btn-hi-via-stream').on('click', () => {
        indexStream.write('hi this is Home via stream')
        indexStream.write('hi this is Home via stream 2')
    })
}

$('#btn-open-foo').on('click', () => {
    fooPage = window.open('/sub-html/foo.html')
})

$('#btn-open-bar').on('click', () => {
    barPage = window.open('/sub-html/bar.html')
    registerBarStream()
})

$('#btn-hi-via-post-message').on('click', () => {
    if (fooPage) {
        fooPage.postMessage('hi this is Home Page', '*')
    }
})

// window.addEventListener('message', ({data}) => {
//     console.log(`Current timestamp ${Date.now()} data: `, data)
// })
```

PS: 由于 `post-message-stream` 底层也会用到 postMessage, 为了不影响测试效果. 这里把 `index.js` 中的监听移除了.

最后修改 `package.json`, 在 script 命令中添加 bar.html 入口...

```log
"start": "parcel index.html sub-html/foo.html sub-html/bar.html"
```

### 运行示例代码

上述示例代码均已上传 [github](https://github.com/luoquanquan/learn-fe/tree/post-message-stream-learn-v2/metamask-learn/post-message-stream-learn) 代码运行的工作过程如下图:

![](https://handle-note-img.niubishanshan.top/post-message-stream.gif)

## 源码分析

post-message-stream@4.0.0 版本引入的 ts, 对于基础逻辑进行了拆分在一定程度上就造成了阅读的困难. 鉴于此, 下文中我们先对 v3 版本解析, 再对 v4 版本解析.

### post-message-stream@3

以下为 post-message-stream@3 版本核心源码, 区区 74 行代码就实现了一个稳定的跨终端的双工流.

```js
// 这个包是对 node stream 模块的封装
const DuplexStream = require('readable-stream').Duplex
// 这个是 node 继承用的, 远古时期有个手写原型继承的面试题. 实现的就是这个
const inherits = require('util').inherits
/*
// 简单的实现大概就是这个样子
function inherits(subCls, supCls) {
    // 子类原型为父类实例, 用于继承父类原型上的方法
    subCls.prototype = new supCls
    // 构造函数修正
    subCls.prototype.constructor = subCls
}
*/

module.exports = PostMessageStream

inherits(PostMessageStream, DuplexStream)

function PostMessageStream (opts) {
  // 这个继承, 太经典了. 具体的知识点忘了可以看看这里
  // https://weread.qq.com/web/reader/751326d0720befab7514782k0723244023c072b030ba601
  DuplexStream.call(this, {
    // 默认情况下 objectMode 为 false, 我们只可以给流里边写入字符串, Buffer 或 Uint8Array.
    // 如果直接怼一个 object 进去, 嘎, 报错了...
    // Uncaught TypeError: Invalid non-string/buffer chunk
    // 所以需要指定 objectMode 为 true 来允许我们在不同终端间传递 object
    objectMode: true,
  })

  // 初始化参数
  this._name = opts.name
  this._target = opts.target
  this._targetWindow = opts.targetWindow || window
  this._origin = (opts.targetWindow ? '*' : location.origin)

  // initialization flags
  this._init = false
  this._haveSyn = false

  window.addEventListener('message', this._onMessage.bind(this), false)
  // send syncorization message
  // 发送握手包
  this._write('SYN', null, noop)

  // 继承自 Duplex, 调用此方法后到调用 this.uncork()
  // 之前写入流中的数据将会保存至缓冲区而不会直接提供给下游消费.
  // 直到调用 this.uncork(); 才会从缓冲区拿出之前写入的所有数据给到下游
  // 在前文示例中, 如果 indexPage 比较猴急, 打开 bar 页面后没等握手完成直接发数据过来
  // 就会写入到缓冲区待用了
  this.cork()
}

// private
PostMessageStream.prototype._onMessage = function (event) {
  var msg = event.data

  // validate message
  if (this._origin !== '*' && event.origin !== this._origin) return
  if (event.source !== this._targetWindow) return
  if (typeof msg !== 'object') return
  if (msg.target !== this._name) return
  if (!msg.data) return

  // 如果当前终端还没有初始化, 先进行初始化
  if (!this._init) {

    // 这个三次握手的过程有点类似 tcp 三次握手的过程, 具体的时序图在下文
    if (msg.data === 'SYN') {
      this._haveSyn = true
      this._write('ACK', null, noop)
    } else if (msg.data === 'ACK') {
      this._init = true
      if (!this._haveSyn) {
        this._write('ACK', null, noop)
      }
      this.uncork()
    }
  //  如果当前终端已经完成初始化, 接受数据并处理
  } else {
    // forward message
    try {
      this.push(msg.data)
    } catch (err) {
      this.emit('error', err)
    }
  }
}

// stream plumbing
// Readable 流实现都必须提供
// Duplex 为双工流可读可写, 所以也必须实现
// 主要用于处理可读流的读取操作的底层逻辑
PostMessageStream.prototype._read = noop

// 向流中写入内容的底层处理, 实质上就是调用了 window.postMessage 告诉对方
PostMessageStream.prototype._write = function (data, encoding, cb) {
  var message = {
    target: this._target,
    data: data,
  }
  this._targetWindow.postMessage(message, this._origin)
  cb()
}

// util

function noop () {}
```

其中, 握手的过程时序图如下:
![20220927114850](https://handle-note-img.niubishanshan.top/20220927114850.png)

### post-message-stream@4

以下为 post-message-stream@4 代码, 相对于 v3 的主要区别是为了适配更多的环境 (node, webWorker) 对于握手和数据处理模块做了更深程度的抽象.

```ts
// BasePostMessageStream.ts

// Nodejs 双工流类
import { Duplex } from 'readable-stream';

// 空函数作为回调默认值
function noop(): void {
  return undefined;
}

// 握手包名称
const SYN = 'SYN';
const ACK = 'ACK';

export type StreamData = string | Record<string, unknown>;

export interface PostMessageEvent {
  data?: StreamData;
  origin: string;
  source: typeof window;
}

/**
 * Abstract base class for postMessage streams.
 * 他说这是个抽象类. 意思是你不能实例化它, 要实例化它的子类
 */
export abstract class BasePostMessageStream extends Duplex {
  // 是否初始化
  private _init: boolean;

  // 是否已经接受/发出过握手包
  private _haveSyn: boolean;

  constructor() {
    super({
      objectMode: true,
    });

    // Initialization flags
    this._init = false;
    this._haveSyn = false;
  }

  /**
   * Must be called at end of child constructor to initiate
   * communication with other end.
   *
   * 子类初始化时候调用的, 开始握手的方法
   */
  protected _handshake(): void {
    // Send synchronization message
    this._write(SYN, null, noop);

    this.cork();
  }

  // 收到其他终端发来的数据处理
  protected _onData(data: StreamData): void {

    //
    if (this._init) {
      // Forward message
      try {
        this.push(data);
      } catch (err) {
        this.emit('error', err);
      }
    } else if (data === SYN) {
      // Listen for handshake
      this._haveSyn = true;
      this._write(ACK, null, noop);
    } else if (data === ACK) {
      this._init = true;
      if (!this._haveSyn) {
        this._write(ACK, null, noop);
      }
      this.uncork();
    }
  }

  /**
   * Child classes must implement this function.
   * 抽象方法, 不同的 runtime 实现的方式不同
   */
  protected abstract _postMessage(_data?: unknown): void;

  _read(): void {
    return undefined;
  }

  // Duplex
  // 发送数据 or 握手包 Duplex 流中调用 write 时触发的底层逻辑
  _write(data: StreamData, _encoding: string | null, cb: () => void): void {
    this._postMessage(data);

    // 调用回调表示写入逻辑处理完成
    cb();
  }
}
```

```js
// WindowPostMessageStream.ts

import {
  BasePostMessageStream,
  PostMessageEvent,
  StreamData,
} from './BasePostMessageStream';

interface WindowPostMessageStreamArgs {
  name: string;
  target: string;
  targetWindow?: Window;
}

/**
 * Window.postMessage stream.
 */
export class WindowPostMessageStream extends BasePostMessageStream {
  // 当前流名称
  private _name: string;

  // 目标流名称
  private _target: string;

  // 目标页面所在的域名
  private _targetOrigin: string;

  // 目标页面 window 对象 (基于 _targetWindow.postMessage)
  private _targetWindow: Window;

  /**
   * Creates a stream for communicating with other streams across the same or
   * different window objects.
   *
   * @param args.name - The name of the stream. Used to differentiate between
   * multiple streams sharing the same window object.
   * @param args.target - The name of the stream to exchange messages with.
   * @param args.targetWindow - The window object of the target stream. Defaults
   * to `window`.
   */
  constructor({ name, target, targetWindow }: WindowPostMessageStreamArgs) {
    if (!name || !target) {
      throw new Error('Invalid input.');
    }
    super();

    // 参数初始化
    this._name = name;
    this._target = target;
    this._targetOrigin = targetWindow ? '*' : location.origin;
    this._targetWindow = targetWindow || window;

    this._onMessage = this._onMessage.bind(this);
    window.addEventListener('message', this._onMessage as any, false);

    // 发起握手请求
    // 如果是第一个终端, 握手请求会被废弃
    // 如果是第二个终端, 握手请求会被第一个终端接收到
    this._handshake();
  }

  // 发送数据, 实际就是调用 window.postMessage
  protected _postMessage(data: unknown): void {
    this._targetWindow.postMessage(
      {
        target: this._target,
        data,
      },
      this._targetOrigin,
    );
  }

  // 接收信息
  private _onMessage(event: PostMessageEvent): void {
    const message = event.data;

    // validate message
    if (
      (this._targetOrigin !== '*' && event.origin !== this._targetOrigin) ||
      event.source !== this._targetWindow ||
      typeof message !== 'object' ||
      message.target !== this._name ||
      !message.data
    ) {
      return;
    }

    // 调用父类定义的 _onData 处理数据
    this._onData(message.data as StreamData);
  }

  // destroy 方法的底层实现
  _destroy(): void {
    window.removeEventListener('message', this._onMessage as any, false);
  }
}
```

### cork & uncork

> 在向流中写入大量小块数据（small chunks of data）时，内部缓冲区（internal buffer）可能失效，从而导致性能下降。writable.cork() 方法主要就是用来避免这种情况。

对于这段我的理解是, 每个可写流会有一个内部缓冲区. 当我们哐哧哐哧给内部缓冲区写小块儿的东西给它怼满了, 就会导致其失效. 所以当我们需要频繁写入小块内容时. 可以先调用 writable.cork 强制将 writable.write 的内容写入到内存中. 等批量小块儿内容写入完成再调用 writable.uncork 统一释放出来.

示例代码:

```js
const { Writable } = require('stream');

class MyWritableStream extends Writable {
    constructor() {
        super()
    }

    _write(data, _encoding, next) {
        console.log(data.toString())
        next()
    }
}

const myWritableStream = new MyWritableStream()

myWritableStream.write('hello world ~')
myWritableStream.write('hello world 2 ~')
myWritableStream.write('hello world 3 ~')
myWritableStream.write('hello world 4 ~')

// 控制台输出:
// hello world ~
// hello world 2 ~
// hello world 3 ~
// hello world 4 ~
```

执行上述代码, 所有的 `hello world` 都会打印出来, 但是如果稍作修改改为以下代码.

```js
const { Writable } = require('stream');

class MyWritableStream extends Writable {
    constructor() {
        super()
    }

    _write(data, _encoding, next) {
        console.log(data.toString())
        next()
    }
}

const myWritableStream = new MyWritableStream()

myWritableStream.write('hello world ~')

// ++++++++++++++++++
myWritableStream.cork()
// ++++++++++++++++++

myWritableStream.write('hello world 2 ~')
myWritableStream.write('hello world 3 ~')
myWritableStream.write('hello world 4 ~')

// 控制台输出:
// hello world ~
```

此时便只会打印出 `hello world ~` 后边三个不会打印, 因为 `myWritableStream.cork()` 之后写入流的内容被强制写入到了内存中没有释放. 再次修改代码, 再最后加上 `myWritableStream.uncork()` 即可释放 `myWritableStream.cork()` 之后写入的数据块.

```js
const { Writable } = require('stream');

class MyWritableStream extends Writable {
    constructor() {
        super()
    }

    _write(data, _encoding, next) {
        console.log(data.toString())
        next()
    }
}

const myWritableStream = new MyWritableStream()

myWritableStream.write('hello world ~')

myWritableStream.cork()

myWritableStream.write('hello world 2 ~')
myWritableStream.write('hello world 3 ~')
myWritableStream.write('hello world 4 ~')

// ++++++++++++++++++
myWritableStream.uncork()
// ++++++++++++++++++

// 控制台输出:
// hello world ~
// hello world 2 ~
// hello world 3 ~
// hello world 4 ~
```

## 思考

也算是熟读了这块的源码还是有些疑惑, 单纯用 postMessage 应该是可以满足小狐狸钱包相关的数据通信的. 使用双工流的优势:
1. 处理大规模数据时不会出现内存瓶颈
2. cork / uncork 保证了主进程在子进程初始化完成前就发送数据的完整性

但是这两个优点 postMessage + 部分逻辑也可以搞定, 想不通作者为啥这么用. 而且根据考古 7 年前(也就是小狐狸项目初期)的 [这次提交](https://github.com/MetaMask/metamask-extension/commit/72a747165dda417aa7968e44b404eb90707202a2) 作者升级了 web3(0.9.2 -> 0.15.1) 同时通信机制从 `postMessage` 切换到了 `post-message-stream` 但是不知两者是否有关联 🤔

## 参考资料

- [parcel 官方文档](https://zh.parceljs.org/)
- [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [post-message-stream](https://github.com/MetaMask/post-message-stream)
- [Duplex 类](http://nodejs.cn/api-v12/stream.html#stream_class_stream_duplex)
- [_read() is not implemented on Readable stream](https://stackoverflow.com/questions/49317685/read-is-not-implemented-on-readable-stream)
- [Node.js 流（stream）：你需要知道的一切](https://zhuanlan.zhihu.com/p/36728655)
- [Node.js Stream - 基础篇](https://tech.meituan.com/2016/07/08/stream-basics.html)
- [Stream writable.cork() and uncork() Method in Node.js](https://www.tutorialspoint.com/stream-writable-cork-and-uncork-method-in-node-js)
- [数据流stream](https://xiaohuochai.site/BE/node/file/stream.html)


