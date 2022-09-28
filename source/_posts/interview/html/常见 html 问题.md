---
title: 常见 html 问题
date: 2021-12-17 22:10:59
categories:
    - 面试
tags:
    - html
---

## innerHTML vs innerText vs outerHTML vs outerText

- innerHTML 设置或者获取标签所包含的 HTML 与文本信息, 不含标签本身
- innerText 设置或者获取标签所包含的文本信息, 不含标签本身
- outerHTML 设置或获取标签本身以及所包含的 HTML 与文本信息, 包含本身
- outerText 设置或获取标签本身以及所包含的文本信息, 包含本身

示例:
```html
<div id="div1"><p>this is text</p></div>
<script>
    const div = document.querySelector("div");
    console.log('div.innerHTML', div.innerHTML);
    console.log('div.innerText', div.innerText);
    console.log('div.outerHTML', div.outerHTML);
    console.log('div.outerText', div.outerText);
</script>

<!-- 控制台打印的结果为
div.innerHTML <p>this is text</p>
index.html:5 div.innerText this is text
index.html:6 div.outerHTML <div id="div1"><p>this is text</p></div>
index.html:7 div.outerText this is text
-->
```

## input 可选的 type

类型 | 作用
--- | ---
text | 文本框
password | 密码框
radio | 单选
checkbox | 复选
file | 文件
hidden | 隐藏
button | 按钮
reset | 重置按钮
submit | 提交按钮
image | 图片按钮

## link 和 import 的区别

1. link 是 html 标签, 而 imort 是 css 提供的关键词
2. Link 加载的 css 文件会在页面加载过程中加载而 import 的 css 文件则需页面加载完成后开始加载
3. Link 方式引入的 css 文件权重高于 @import
