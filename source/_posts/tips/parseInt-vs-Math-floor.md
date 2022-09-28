---
title: parseInt vs Math.floor
date: 2020-02-04 01:20:31
categories:
  - JavaScript
tags:
  - js
  - Number
---

> parseInt 和 Math.floor 都可以实现取整, 但是处理的方式存在差别

## parseInt

parseInt(string, radix) 将一个字符串 string 转换为 radix 进制的整数, radix 为介于 2 - 36 之间的整数, 如果 radix 传入的是 0, 会以默认值 10 处理.

其中

string: 是要被解析的字符串, 如果传入的值不是一个字符串则会将其转化成字符串(toString 方法), 字符串开头结尾的空白字符会被忽略

radix: 一个介于 2 - 36 的整数, 表示的是上述字符串的基数. 默认值是 10, 如果传入的 radix 小于 2 或者大于 36 则返回 NaN

<!-- more -->

- 可以处理数字(调用数字的 toString 方法将其转化成字符串)
  - parseInt(1.1) -> 1
  - parseInt(1.9) -> 1
  - parseInt(0.9) -> 0
  - parseInt(-1.9) -> -1
- 可以处理 <font color="red">数字开头的字符串</font>
  - parseInt('-1') -> -1
  - parseInt('10px') -> 10
  - ...
- 可以把 2 - 36 进制的数转为 10 进制
  - parseInt(11, 2) -> 3
  - parseInt(11, 8) -> 9
  - parseInt(11, 10) -> 11
  - parseInt(11, 16) -> 17
  - parseInt(11, 36) -> 37
  - ...

## Math.floor

Math.floor(x) ===  向下取整, 返回小于或者等于给定数字的最大整数

其中 x 是需要解析的数字

- Math.floor(1.2) -> 1
- Math.floor(1.9) -> 1
- <font color="red">Math.floor(-1.2) -> -2</font> 真正的向下取整
- Math.floor('1.9') -> 1 也可以处理字符串(不建议用)

## parseFloat

parseFloat(x) 函数可解析一个字符串, 并返回一个浮点数

其中 x 是需要解析的字符串

parseFloat 将它的字符串参数解析成为浮点数并返回. 如果在解析过程中遇到了正负号 (+ 或 -) 数字 (0-9) 小数点, 或者科学记数法中的指数 (e 或 E) 以外的字符, 则它会忽略该字符以及之后的所有字符, 返回当前已经解析到的浮点数. 同时参数字符串首位的空白符会被忽略

PS: 如果字符串的第一个字符不能被转换为数字, 那么 parseFloat() 会返回 NaN.
