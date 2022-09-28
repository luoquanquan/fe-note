---
title: 输入 URL敲下回车发生了什么
date: 2021-12-09 20:54:37
categories:
    - 面试
tags:
    - 网络
---

1. URL 解析, 首先浏览器会解析你渐入的 url 是否为一个合法的 url, 包含 协议, 域名, 端口, 路径, 查询字符串, 锚点哈希等信息…

![URL 解析示意图](https://handle-note-img.niubishanshan.top/2021-12-10-10-24-55.png)

2. DNS 查询, 通过 DNS 查询找到目标服务器的 ip 地址

![DNS 查询过程](https://handle-note-img.niubishanshan.top/2021-12-10-10-25-28.png)

<!-- more -->

3. TCP 连接, 经过三次握手创建 TCP 链接

![TCP 链接](https://handle-note-img.niubishanshan.top/2021-12-10-10-25-51.png)

4. HTTP 请求, 建立 tcp 链接完成后便开始发送 http 请求了, 请求内容包含请求行, 请求头, 请求体. 所以本质上 get 和 post 是一样的

![发送 http 请求](https://handle-note-img.niubishanshan.top/2021-12-10-10-26-17.png)

5. 响应请求, 服务器接收请求并处理后返回响应信息, 包含状态行, 响应头, 和响应正文

![接收服务端返回的响应](https://handle-note-img.niubishanshan.top/2021-12-10-10-26-28.png)

6. 页面渲染, 浏览器对返回的响应内容进行解析. 具体步骤为:
    - 解析 html 构建 DOM 树
    - 解析 css 构建 CSSOM 树
    - DOM 树和 CSSOM 树合并, 生成 render(渲染)树
    - 布局 render 树, 计算元素尺寸和位置
    - 绘制 render 树, 绘制像素级信息
    - 通过 GPU 展示内容到屏幕上, 具体实现过程如下图:

![浏览器渲染过程示意图](https://handle-note-img.niubishanshan.top/2021-12-10-10-27-09.png)
