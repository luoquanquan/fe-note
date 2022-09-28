---
title: Link 标签和 a 标签有啥区别
date: 2021-12-12 18:02:21
categories:
    - 面试
tags:
    - html
---

## 相同点

1. 渲染结果相同, 两者渲染的结果都是 a 标签
2. 实现功能相同, 都能够实现页面的跳转

## 不同点

1. Link 标签的跳转只会触发与之相匹配的 Route 对应的页面内容更新. 不会触发整页的刷新, 而 a 标签的跳转会刷新整个页面
2. Link 标签一般需要配合 Route 使用, a 标签可以随意添加
3. Link 标签实际上是禁用了 a 标签原有的跳转能力之后自行实现的跳转
```js
[...document.getElementsByTagName('a')].forEach(a => {
    a.onclick = e => {
        // 阻止默认跳转事件
        e.preventDefault()
        location.href = this.href
    }
})
```
