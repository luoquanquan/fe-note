---
title: HTTP 协议的进化史
date: 2021-12-09 20:42:00
categories:
    - 面试
tags:
    - 网络
---

## HTTP 0.9

1. 只有一个 GET 命令
2. 没有 Header 等描述信息
3. 服务端内容返回成功之后便会关闭 TCP 链接
4. 只能发送文本文档, 不支持图片视频等多媒体资源

## HTTP 1.0

1. 扩充了传输内容的格式, 支持了图片, 视频, 二进制文件的数据的传递. 为多媒体互联网的大发展奠定了基础
2. 增加了 POST, PUT, HEADER 等请求方法
3. 增加了 statusCode 和 header 内容, 用于描述请求会话
4. 增加了多字符集的支持, multi-part 发送, 权限, 缓存, 和内容编码等
5. 新增了缓存能力 Expire 字段

<!-- more -->

![HTTP 1.0 模型](https://handle-note-img.niubishanshan.top/2021-12-09-20-43-34.png)

HTTP 1.0 的一个缺点, 就是每个 TCP 链接只能发送一个请求, 数据发送完毕字后就会断开 TCP 链接. 如果需要请求其他资源就需要重新创建 TCP 链接. 如果 你想要请求完毕之后保留 TCP 链接不断开可以显式设置: Connection: keep-alive

## HTTP 1.1

1. 持久链接, 设置了 TCP 链接在数据发送完成后默认不关闭, 可以在后续的请求中复用. 客户端或者服务端发现另外一方一段时间内没有动静也可以主动关闭链接. 比较规范的做法是: 客户端在最后一个请求时设置 Connection: close 明确告诉服务器关闭 TCP 链接
2. 增加了管道机制, 可以在同一个 TCP 管道中发送多个 http 请求, 然而在 http 1.1 中虽然可以利用同一个 TCP 管道发送多个请求. 但是利用同一管道的请求是串行的而非并行. 就像是厕所蹲坑. 如果你前边是一个"快男", 那么恭喜你. 但是如果你的前边是一个便秘老哥. 那就 GG 了.你得等着他完事儿才能整
3. 增加了 HOST 请求头, 有了 HOST 之后就可以在一台服务器上同时跑多个 web 服务, 也就是实现了虚拟主机技术. 比方说你访问 baidu.com 的时候 HOST 就是baidu.com 提高了主机的利用率
4.扩充了缓存策略,  Cache-Control Etag last-modified 等缓存字段
5. 引入 range, 允许客户端请求资源的某一段

![HTTP 1.1 模型](https://handle-note-img.niubishanshan.top/2021-12-09-20-43-56.png)

## HTTP 2.0

1. 多路复用, 复用的 TCP 链接里, 客户端和服务器都可以同时发送多个请求 or 响应, 而不是按照先后顺序一一排队. 避免了 - 队头阻塞

![HTTP 2.0 多路复用模型](https://handle-note-img.niubishanshan.top/2021-12-09-20-45-07.png)

客户端请求 js 和 css 文件的请求是同时发出的, 而服务端返回文件的返回也是同时进行的

2. 二进制分帧, 帧是 http 2 通信中最小的单位信息, 多个帧之间可以乱序发送, 接收方可以根据帧的首部信息重新进行组装, 这也是多路复用实现的条件
3. 首部压缩, http 2 在客户端和服务端启用"首部表"来跟踪和存储之前发送的键值对, 对于相同的数据不再通过每次请求和响应都携带. 该"首部表" 在链接存续期内始终存在, 由客户端和服务器共同渐进更新
![首部压缩模型](https://handle-note-img.niubishanshan.top/2021-12-09-20-48-07.png)

如图所示, 请求 1 中已经发送过的头信息到了请求 2 中不再发送. 请求只会携带之前没有发送过的部分

4. 服务器推送, http 2 引入的服务器推送允许服务器推送资源给客户端. 通过该功能服务器可以预先推断客户端将来可能需要的资源并主动推送给客户端, 如下图

![服务器推送模型](https://handle-note-img.niubishanshan.top/2021-12-09-20-48-46.png)

如图所示, 在没有服务器推送能力时, 客户端请求完 html 之后解析到 link 标签之后再发起请求, 但是开启服务器推送之后, 用户访问 html 时候服务器就预知到客户端将来会请求 css 文件, 并同 html 一起返回给客户端

## 常见的状态码

### 1xx 表示继续

- 100: 客户端继续发送请求, 这只是个临时响应
- 101: 根据客户端的请求切换协议, 主要用于 websocket or http2 升级

### 2xx 表示成功

- 200: 请求成功, 响应结果正常返回
- 201: 请求成功并且服务器创建了新资源
- 202: 服务器接收到请求, 但是尚未处理
- 203: 非授权信息, 服务端已经处理请求, 但是返回信息来自另一来源
- 204: 无内容, 服务器成功处理请求, 但是尚未返回任何内容, options 请求
- 205: 重置内容, 服务器成功处理请求, 但是尚未返回任何内容
- 206: 部分内容, 服务器返回了部分内容

### 3xx 表示重定向

- 301: 永久重定向, 浏览器会缓存结果下次访问自动跳转不再请求源链接
- 302: 临时重定向, 引导浏览器到新的地址请求资源, 但是不能缓存该结果, 下次访问该地址还应当询问服务器
- 303: 请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码
- 304: 重定向到本地, 也就是协商缓存
- 305: 请求者只能使用代理访问请求的网页, 如果服务器返回此响应, 还表示请求者应使用代理
- 307: 临时从定向, 和 302 的区别主要是 307 会保证请求方法不会变化. 对于老的客户端, 302 可能会将原来的请求方法转化为 GET 并进行请求. 但是 307 就能保证原来的请求方式和其数据不变

### 4xx 表示请求错误

- 400: 请求错误, 主要是请求参数错误. 没有通过后端的校验
- 401: 未授权, 没有登录的时候不能访问用户数据
- 403: 禁止访问, 比方说在外网环境下访问公司内部系统
- 404: 找不到对象, 哈哈哈哈
- 405: 方法禁用, 我这个请求只能用 POST 你用 GET 太气人了
- 415: 请求内容过长, GET 请求参数过长问题. 想当初我可是把百家号的诊断接口搞挂了 ~

### 5xx 服务器错误

- 500: 服务器内部错误
- 502: 错误网关, 一般是重启 nginx 的时候会报这个
- 503: 服务不可用, 目前排队过多或者服务挂掉了
- 504: 网关超时, 请求还没有到业务服务器就超时了

## 常见状态码的用处

- 100: 客户端在发送POST数据给服务器前, 征询服务器情况, 看服务器是否处理POST的数据, 如果不处理, 客户端则不上传POST数据, 如果处理, 则POST上传数据. 常用于POST大数据传输
- 206: 一般用来做断点续传, 或者是视频文件等大文件的加载
- 301: 永久重定向会缓存. 新域名替换旧域名, 旧的域名不再使用时, 用户访问旧域名时用301就重定向到新的域名
- 302: 临时重定向不会缓存, 常用 于未登陆的用户访问用户中心重定向到登录页面
- 304: 协商缓存, 告诉客户端有缓存, 直接使用缓存中的数据, 返回页面的只有头部信息, 是没有内容部分
- 400: 参数有误, 请求无法被服务器识别
- 403: 告诉客户端进制访问该站点或者资源, 如在外网环境下, 然后访问只有内网IP才能访问的时候则返回
- 404: 服务器找不到资源时, 或者服务器拒绝请求又不想说明理由时
- 503: 服务器停机维护时, 主动用503响应请求或 nginx 设置限速, 超过限速, 会返回503
- 504: 网关超时
