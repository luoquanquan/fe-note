---
title: eventListener
date: 2020-02-25 11:20:31
categories:
  - 前端
tags:
  - event
---

## addEventLintener 三种用法

```js
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
target.addEventListener(type, listener, useCapture, wantsUntrusted);  // Gecko/Mozilla only
```

其中,
- type 表示事件类型
- listener 表示绑定的事件触发时执行的回调
- options **可选参数** 一个指定 listener 属性的对象, 本笔记重点
  - capture `Boolean` 是否启动事件捕获
  - once `Boolean` 事件处理程序是否只能执行一次, 若为 `true` listener 调用后会自动移除
  - passive `Boolean` 若此值为 `true`, 表示 listener 内不能调用 `preventDefault`, 强行调用的话也不会生效, 只会抛出一个警告
  - mozSystemGroup `Boolean` 表示 listener 被添加到 system group, <font color="red">兼容性不强, 慎用.</font>
  - 以上几个值的默认值都是 `false`
- useCapture **可选参数** 默认值 `false`
  -
