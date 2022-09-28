---
title: sourcemap 是什么有何作用
date: 2021-12-12 18:00:51
categories:
    - 面试
tags:
    - webpack
---

## 概念

source map 是将编译, 打包, 压缩后的文件映射回源代码的工具. 由于打包压缩后的代码可读性不足, 于是在开发生产过程中就需要通过 source map 定位到源代码并调试.

## 常用方案

生产环境使用 source map 的方式主要有以下几种:
1. hidden-source-map: 借助第三方监控平台 Sentry 使用
2. nosource-source-map: 只会展示具体的行数以及源代码的错误栈, 相对于 source-map 更安全
3. source-map: 生成完整的 source-map, 并且通过 nginx 配置只有公司内网可以访问, 其他环境直接 deny

PS: map 文件只要用户不打开浏览器的控制台, 浏览器是不会主动加载
PS: 生产环境下不要启用 inline- 族和 eval- 族的 source-map 配置. 因为这会大大正价 bundle 包的大小, 降低页面加载的性能...
