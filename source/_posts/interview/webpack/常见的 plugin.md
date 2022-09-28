---
title: 常见的 plugin
date: 2021-12-12 17:12:29
categories:
    - 面试
tags:
    - webpack
---

[webpack plugins 文档](https://www.webpackjs.com/plugins/)

- html-webpack-plugin: 生成 html 模板
- DefinePlugin: 在项目中定义环境变量, webpack 4 之后会根据 mode 字段自动定义环境变量
- IgnorePlugin: 忽略部分文件的编译
- CmmonsChunkPlugin: 提取公共代码, wp4 之后已经不推荐使用, 提取公共代码可以通过 SplitChunksPlugin 来
- SplitChunksPlugin: CommonsChunkPlugin替代, 配置: optimization.splitChunks
- ProgressPlugin: 命令行展示打包的进度
- UglifyJsPlugin: 压缩 js 的插件, 不支持 es 的压缩. Wp4 之后不推荐用
- TerserWebpackPlugin: wp4 之后的 js 压缩工具
- extract-text-webpack-plugin: css 模块提取独立文件, wp 5 之后不推荐使用
- mini-css-extract-plugin: wp 5 之后的 css 提取工具
- Clean-webpack-plugin: 清理 webpack 打包结果
- Speed-measure-webpack-plugin: 监控 webpack 打包耗时
- webpack-bundle-analyzer: 可视化 webpack 输出模块的体积
