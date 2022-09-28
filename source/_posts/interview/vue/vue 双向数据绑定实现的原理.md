---
title: vue 双向数据绑定实现的原理
date: 2021-12-15 10:12:18
categories:
    - 面试
tags:
    - vue
---

## 基本原理

Vue 采用了数据劫持结合发布-订阅的模式, 通过 Object#defineProperty 方法劫持各个成员的 getter, setter. 在数据变动的时候发布消息给订阅者触发相应的回调, 由于是在不同数据变动时触发的消息. 也就可以精确的将变更发送给绑定的视图. 而不是对所有的数据都进行更新. 具体的步骤为:

<!-- more -->

1. 对于需要 observer 的数据进行递归遍历, 给每个成员都加上 getter 和 setter. 这样将来给对应的成员赋值的时候就会触发 setter 实现数据变化的监听
2. Compile 解析模板指令, 将模板中的变量替换成数据. 并将每个指令对应的节点绑定更新函数. 添加监听数据的订阅者. 一旦数据有了变动便能收到通知更新视图
3. Watcher 订阅者是 Observer 和 compile 之间的通信桥梁
    - 在自生实例化时往订阅器(dep)里添加自己
    - 自生存在一个 update 方法
    - 待属性变动接收到 dep#update 通知时, 调用自生的 update 方法触发 compile 中绑定的回调
4. mvvm 作为数据绑定的入口, 整合了 observer, compile, watcher 三者. 通过 observer 监听自己的 modal 数据变化. 通过 compile 来编译模板指令. 最终通过 watcher 作为沟通两者的桥梁. 达到了数据变化可以更新视图, 视图变化也可以更新数据的双向绑定效果.

## 3.0 之前和 3.0 的比较

### 基于数据劫持 / 依赖收集的双向绑定优点

1. 不需要显式调用, 通过数据劫持 + 发布订阅的方案. 可以直接通知视图的更新
2. 直接精确得到变化的数据, 因为劫持了所有成员的 setter, 当属性值变化的时候我们可以精确的获取变化的内容 newValue 不需要进行额外的 diff 操作去查找变化的部分.

### Proxy vs Object.defineProperty

#### Proxy 的好处

1. 可以监听数组
2. 13 种监听方法, 比 defineProperty 的 getter / setter 更强大. get, set, has, deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, preventExtensions, getPrototypeOf, isExtensible, setPrototypeOf, apply, construct
3. 返回新的对象, 而非直接修改原对象.

#### Proxy 的缺点

兼容性不给力, 而且低版本浏览器中没法用 pollfill 实现
