---
title: 内部属性[[class]]
date: 2022-06-09 17:15:27
categories:
    - 面试
tags:
    - class
---

所有 typeof 返回值为 object 的对象, 都会包含一个内部属性\[\[class\]\]. 一般来说把它当成一个内部的分类. 这个分类的值无法直接访问, 需要通过 Object.prototype.toString() 来查看

```js
Object.prototype.toString.call([])
// "[object Array]"

Object.prototype.toString.call(function() {})
// "[object Function]"
```
