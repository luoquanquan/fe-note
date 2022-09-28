---
title: 字符串中的 substring 和 substr 方法
date: 2020-11-14 13:20:31
categories:
  - 前端
tags:
  - js
---

## substring 方法

`substring` 方法用于截取某个字符串位于起始位置到终点位置中间的字符, `substring(start[, end])`. 其中 `start` 指的是截取子串的起始下标, `end` 指的是截取子串的结束下标.

```js
var str = '012345'
console.log(str.substring(1, 4))  // 123
console.log(str.substring(1))     // 12345
console.log(str.substring(1, 1))  // ''
console.log(str.substring(2, 0))  // '01'
console.log(str.substring(-5, 2)) // '01'
```

通过示例可知:
- `substring` 的效果是包前不包后的截取
- 当忽略第二个参数的时候, 默认从第一个位置截取到字符串的末尾位置.
- 当两个参数相等的时候, 会截取一个空的字符串
- 当第二个参数小于第一个参数的时候, 会交换两个参数的位置
- 当参数中存在负数的时候会先将负数转为 0

## substr 方法

`substr` 方法用于截取字符串从指定位置开始的指定长度的字符, `substr(start[, length])`. 其中 `start` 指的是截取子串的起始下标, `length` 指的是截取子串的长度

```js
var str = '012345'
console.log(str.substr(1, 4))  // 1234
console.log(str.substr(1))     // 12345
console.log(str.substr(2, 0))  // ''
console.log(str.substr(2, -1)) // ''
console.log(str.substr(-2, 3)) // '45'
```

通过示例可知:
- 没有传入 `length` 属性的时候会截取整个字符串
- 当 `length` 属性传 0 或者负数的时候会截取空字符串
- 如果 `start` 参数传负数, 认为从字符串末尾开始倒数
