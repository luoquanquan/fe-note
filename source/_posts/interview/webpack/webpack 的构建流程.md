---
title: webpack 的构建流程
date: 2021-12-12 15:56:59
categories:
    - 面试
tags:
    - webpack
---

## 简述 webpack 的构建流程

1. 初始化参数: 从配置文件和 shell 语句中读取与合并参数, 得出最终的参数
2. 开始编译: 基于第一步的参数初始化 Compiler 对象. 加载所有配置的插件, 执行对象的 run 方法开始编译
3. 确定入口: 根据配置文件找到所有的入口文件
4. 编译所有模块: 从入口文件触发, 调用所有配置了 loader 进行模块编译. 找出该模块依赖的模块递归处理. 直到处理完成所有的模块
5. 完成编译模块: 在经过第四步的处理后得到了每个模块编译的结果, 并能获取到各个模块之间的关系.
6. 输出资源: 根据入口文件和模块间的依赖关系, 组装成一个个包含多个模块的 chunk 再把每个 chunk 转换成一个个单独文件加入到输出列表. 这里是可以修改输出资源的最后机会
7. 输出完成: 确定好输出内容后, 根据输出文件路径和文件名. 把文件写入到文件系统中

在上述各个步骤中, webpack 都会广播特定的事件. 插件在监听到关注的事件以后就会启动自生的逻辑. 调用 webpack 提供的 api 以影响最终生成的结果
