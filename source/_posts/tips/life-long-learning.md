---
title: Life Long Learning
date: 2020-03-13 12:10:31
categories:
  - Tips
tags:
  - 终生学习
---

## 前端开发 Tips

- 凡是遇到固定大小的内容区域时, 都要考虑内容长度可能超出容器(内容溢出)
  - 数字
  - 金额
  - ...
- 凡是有表单提交的地方, 都要考虑表单内容修改的回显能力

## 数据统计相关小 Tips

- 凡是计算平均值, 百分比的运算, 都要考虑所有项都是 0 的情况, 因为 0 / 0 = NaN
- 遇到需要全局唯一的变量时, 用一个自增变量比费劲搞随机字符串时间戳之类的东西靠谱方便
- 始终返回值都是布尔值的函数, 函数名称推荐用 is 开头, ex: isSameColor

## 不要用 js 进行小数计算

在以前的认识中, 小数的计算确实不好用. 但是可以通过乘以 10 的整数倍, 转成整数之后再进行整数计算 `16.666 * 1e3 => 16666`. 直到有一天 `16.368 * 1e3 => 16367.999999999998`, 卧槽, 卧槽, 卧槽...

鉴于此, 对于用户输入的小数点后三位有值的 input 可以先用字符串处理 `'16.368'.split('.')` 然后转化成 `16 * 1e3 + 368` 来避免因精度误差可能带来的坑 ~

## position: fixed; 作为 transform 元素子元素

这是一个十年前就有人问过的问题 [stackoverflow](https://stackoverflow.com/questions/2637058/positions-fixed-doesnt-work-when-using-webkit-transform)当你的 position: fixed; 的元素包裹在使用了 transform 属性的元素的时候, fixed 定位就会失效, 不能固定定位了.

### 参考文档

- [那些遇到的position-fixed无效事件](https://xinpure.com/position-fixed-encountered-an-invalid-event/)
- [https://drafts.csswg.org/css-transforms-1/#containing-block-for-all-descendants](https://drafts.csswg.org/css-transforms-1/#containing-block-for-all-descendants)

## iOS 10 直接使用 ele.style = "" bug

在写 js 蒙层的时候为了方便直接写了 `modalEle.style = "width: 100%; height: 100%;"` 在安卓中没啥问题. 但是在 `iOS 10` 上报了错误 <font color="red">attempted to assign to readonly property</font> 尝试分配只读属性. 也就是说 `ele.style` 不能重新赋值不能只能修改其属性, 修改为一下代码即可解决:

```js
modalEle.style.width = '100%';
modalEle.style.height = '100%';
```

### 参考文档

- [ios设备出现attempted-to-assign-to-readonly-property报错](https://blog.csdn.net/weixin_45532305/article/details/107319854)

## ele.append 在 Android 6.0 有兼容问题

document.body.append is not a function

具体的兼容性信息[参考文档](https://caniuse.com/mdn-api_element_append)
