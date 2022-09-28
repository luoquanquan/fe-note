---
title: 移除inline-block间隙的方法
date: 2021-12-12 16:15:03
categories:
    - 面试
tags:
    - css
---

由于编写代码的时候难免会有间隔设置为 inline-block 的元素就会出现间隔, 解决方法有以下几种:
1. 去掉元素之间的空格, 所有的代码都紧挨着写
2. 利用 html 注释, 所有边间质检的空隙都用注释填充
3. 取消标签闭合, 这样空隙的部分就算到标签里边了. 经过我的测试子元素是 a 标签的时候是好使的. 但是 span 标签 GG 了
```html
<style>
    a {
        display: inline-block;
    }
</style>
<div>
    <a>你好
    <a>我的间距不见了
    <a>哈哈哈, 气不气
</div>
```
4. 在父容器设置 font-size: 0; 也可以实现不展示间隔
