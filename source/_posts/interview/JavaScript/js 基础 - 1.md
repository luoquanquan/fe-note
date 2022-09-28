---
title: js 基础 - 1
date: 2021-12-18 10:17:04
categories:
    - 面试
tags:
    - js
---

## null vs undefined

### 默认为 null 的情况:
- 手动设置变量的值或者对象的某一属性值为 null(表示此时没有值, 以后可能会赋值)
- js DOM 元素获取的方法中, 如果没有获取到指定的元素对象. 默认返回 null
- Object.prototype.__proto__ === null
- 正则捕获时, 捕获不到匹配的模式时会返回 null

### 默认为 undefined 的情况:
- 变量提升, 只声明未定义的变量值就是 undefined
- 严格模式下, 没有指定函数的执行上下文, 其内部的 this 就是 undefined
- 获取对象没有的属性时, 返回 undefined
- 函数定义了形参但是没有传入实参, 默认值 undefined
- 函数没有显式的返回值, 默认返回 undefined

## vuex vs localStorage

### 本质区别

- vuex 存储在内存中, 读取速度快.
- localStorage 以文件的形式存储在本地硬盘, 相对而言内存中读取内容速度更快.

### 应用场景不同

vuex 是专门为 vue 应用程序开发的状态管理工具. 采用了集中的方案管理所有组件的状态. 并以对应的规则约定了状态只能以一种可预测的方式改变. 保证了应用状态的一致性和可维护性...

localStorage 是 html5 新增的本地存储 api, 是通过 js 将数据存储到本地的方法. 一般用于跨页面的数据传递

PS: vuex 能够做到数据的响应式, localStorage 不能做到响应式. 需要自行处理

### 存续时长不同

- vuex 存储的数据均为会话级别, 刷新浏览器之后所有数据都会丢失.
- localStorage 存储的数据是长期的, 只要用户不主动删除数据, 其值可以保持存在

### 总结

由于 localStorage 存储的数据不具备响应式特性, 数据改变时无法通知引用它的组件更新. 所以无法用 localStorage 替换 vuex. 但是由于其长效存储的特性, 可以用 localStorage 存储用户编辑一半的表单. 实现本地的草稿箱

## 判断变量是否为数组

1. Array#prototype#isPrototypeOf(obj)
2. obj instanceof Array
3. Object#protorype#toString#call(obj) === '[object Array]'
4. Array#isArray(obj)

## script 中的 defer 和 async 的区别

- 默认的 script 标签引入 js 浏览器会立即加载并执行相应的 js 文件. 同时会阻塞后续文档的渲染.
```html
<script src="demo.js"></script>
```

- 添加 async 属性之后, 表示 js 的加载和执行和文档的渲染是并行进行的, 也就是说是异步执行的
```html
<script async src="demo.js"></script>
```

- 添加 defer 属性后, js 文件的加载和文档的渲染是并行的. 但是 js 文件只有在文档渲染完成后(DOMContentLoaded 触发后)才会执行. 如果是需要获取 dom 元素的 js 文件需要使用 defer
```html
<script defer src="demo.js"></script>
```

1. 两者的加载过程是一样的, 都是异步加载
2. 两者的区别在于加载完成之后的执行时机, async 为加载完成之后立即执行. 但是 defer 为加载完成之后等待 DOMContentLoaded 才会执行
