---
title: 常见的 loader
date: 2021-12-12 16:47:28
categories:
    - 面试
tags:
    - webpack
---

[webpack loaders 文档](https://www.webpackjs.com/loaders/)

- file-loader: 把文件拷贝到输出文件夹中, 并在代码引用文件的位置修改文件输出路径
- url-laoder: file-loader + 把小文件转成 base 64 的能力
- image-loader: 加载并压缩图片使用
- babel-loader: 转码高级 js 语言
- ts-loader: 转码 ts
- style-loader / css-loader / postcss-loader / less-loader / sass-loader
- eslint-loader: 检查代码语法
- vue-loader: 解析 .vue 单文件
- cache-loader: 可以用于缓存其他 loader 生成的文件, 优化打包速度
- exports-loader: 将原本没有导出语句的模块导出出来
```js
// hello.js
window.hello = () => console.log('hello world')

// a.js
import {hello} from './a.js'
hello()

// 配置文件
{ test: require.resolve('./hello.js'), loader: "exports?hello" }

// 其实相当于在 hello 中添加了一行导出语句
// export const hello = hello
// 所以在 a.js 中就可以直接引用了
```
- imports-loader: 相当于 exports-loader 的逆运算, 你可以通过这个给指定模块添加一些 import 语句, 可以用在给模块添加通用依赖
- expose-loader: 有些库(例如 webuploader)需要全局的 jQ 对象, 但是我们并没有使用 cdn 的方式导入 jq. 会导致三方库访问不到报错. 测试就可以使用 `expose-loader` 将模块化的 jQ 对象挂载到全局 ~
```js
// 使用 expose-loader
import "expose-loader?exposes=$,jQuery!jquery"

// 这样就会在 window 上添加 $ 和 jQuery 变量, 指向 node_modules 中的 jq
```
- thread-loader: happy-pack 官方推荐的替换方案, 就是开启多进程编译用的 loader
