---
title: loader vs plugin
date: 2021-12-12 16:23:40
categories:
    - 面试
tags:
    - webpack
---

## 作用不同

loader 直译为加载器, webpack 将一切文件视为模块, 但是其原生只能解析 js 文件, 如果想要打包其他文件的话就需要用到 loader 进行一次转化. Loader 赋予了 webpack 解析非 js 文件的能力. plugin 直译为插件, 其可以拓展 webpack 的功能, 让 webpack 具备更多的灵活性. 在 webpack 运行的生命周期中会广播出很多事件. Plugin 可以监听这些事件. 在合适的时机通过 webpack 提供的 api 改变输出的结果

<!-- more -->

## 用法不同

loader 在 module#rules 中配置, 也就是说作为模块的解析规则存在. 类型为数组, 每一项都是一个 Object, 里边除了配置类型匹配规则还指定了 loader 以及 loader 的 options. Plugin 在 plugins 中单独配置. 类型为一个数组每一项都是一个 plugin 实例, 参数由构造函数传入
