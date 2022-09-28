---
title: === vs ==
date: 2021-12-12 17:49:04
categories:
    - 面试
tags:
    - js
---

## 两者的区别

1. === 为恒等符, 当两边的变量类型相等的时候进行对比, 值相等返回 true 不相等则返回 false
2. == 为等值符, 两边变量类型相同时直接比较是否相等, 否则会进行转化

## 转化规则

1. 如果一个是 null 一个是 undefined, 相等
2. 如果一个是字符串一个是数字, 把字符串转化成数字再比较
3. 如果一个是Boolean 那么把布尔值转化成数字再比较
4. 如果一个是对象,  另外一个是数字 or 字符串. 把对象转成原始值在比较
5. 其他类型的都不相等

对象转原始值其实就是调用其Symbol.toPrimitive, 你可以改写对象的这个方法参考: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive
默认情况下大多是优先调用自身的 valueOf 方法. 只有 Date 对象除外, 会优先调用 toString 方法
