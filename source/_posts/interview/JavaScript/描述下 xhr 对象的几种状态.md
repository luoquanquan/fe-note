---
title: 描述下 xhr 对象的几种状态
date: 2021-12-12 17:23:47
categories:
    - 面试
tags:
    - js
---

readyState | 对应的时机
--- | ---
0 | 初始化, 也就是 new 完 XMLHttpRequest 之后的状态
1 | 启动, 调用 xhr 实例 open 方法后的状态
2 | 调用 xhr 实例 send 方法后请求已经完全发送, 服务端收到请求但是尚未解析
3 | 开始接收来自服务端的响应
4 | 完成, 接收服务端响应结束
