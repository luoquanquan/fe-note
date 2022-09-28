---
title: 常见的 content-type 值
date: 2021-12-12 17:29:40
categories:
    - 面试
tags:
    - js
---

1. application/x-www-form-urlencoded: form 表单默认格式, 数据被编码为键值对
2. application/json: restful 接口常用方案, 以序列化 json 的形式传递数据
3. text/xml: 以 xml 方式传递数据, 现在已经不常用了
4. multipart/form-data: 这个类型主要用于表单需要上传文件的时候, 因为文件需要以二进制的方式展示. 不设置这个类型无法上传文件
5.  application/octet-stream: 用于响应头中, 表示未分类的二进制数据. 浏览器遇到这个响应头之后会直接下载文件. 还可以通过设置 Content-Disposition: attachment; filename=fileName.ext 指定下载文件名
