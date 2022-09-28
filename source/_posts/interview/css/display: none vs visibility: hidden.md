---
title: display none vs visibility hidden
date: 2021-12-12 17:59:19
categories:
    - 面试
tags:
    - css
---

1. Display: none 会让元素从渲染树中消失, 不占据任何空间.  visibility: hidden 不会让元素消失, 仍然占据渲染空间只是内容不可见
2. Display: none 是非继承属性, 子孙节点的不可见原因为父节点没有在渲染树中渲染导致.  visibility: hidden 是继承属性, 子孙属性的不可见是由于继承了父级的 hidden. 如果设置  visibility: visible 仍然可以展示出来
3. 修改 display 属性会触发子组件的回流而修改 visibility: hidden只会触发子组件的重绘
4. 读屏器会读取  visibility: hidden的内容, 但是无法读取 display: none 的元素
