---
title: css 常见问题
date: 2021-12-12 17:30:23
categories:
    - 面试
tags:
    - css
---

元素包含内容 content, 内边距 padding, 边框 border, 外边距 margin

盒模型属性值包含 content-box, border-box, inherit 区别如下

- content-box: 总宽度 = margin + border + padding + width, 也就是标准盒模型
- border-box: 总宽度 = margin + width, 传说中的 ie 盒模型也叫怪异盒模型
- inherit: 继承父级的盒模型

## DOM Tree 与 Render Tree 之间的区别是什么

DOM Tree: 包含了所有的 HTML 标签, 包括 display: none 的元素, JS动态添加的元素等.
Render Tree: DOM Tree 和样式结构体结合后构建呈现 Render Tree. Render Tree 能识别样式, 每个 node 都有自己的style, 且不包含隐藏的节点(display: none)

## CSS 权重列表

权重 | 选择器
--- | ---
10000 | !important
1000 | 内联样式
100 | id 选择器
10 | 类 / 伪类 / 属性选择器
1 | 标签 / 伪元素选择器
0 | 通用选择器 * / 子选择器 > / 相邻选择器 + / 同胞选择器 ~

## 垂水居中

1. 绝对定位 + 位置偏移
    a. 已知尺寸左上 margin: -(尺寸一半)
    b. 未知尺寸 translate: (-50%, -50%, 0)
2. flex 布局
3. tabel 布局
    父元素:
        display: table-cell;
        vertical-align: middle;  // 垂直居中
        text-align: center;     // 水平居中

## margin 塌陷的解决办法

当盒子在垂直方向设置 margin 时会存在塌陷情况, 解决方案如下:

1. 给父级添加 border
2. 给父盒子添加 padding-top
3. 给父盒子添加 overflow: hidden
4. 父盒子 position: fixed
5. 父盒子 display: table
6. 在子元素的前边添加一个兄弟元素并设置属性为 content: ''; overflow: hidden;
