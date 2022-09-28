---
title: 我在使用 AudioContext 过程中遇到的 9 个问题
date: 2021-11-16 16:25:42
categories:
    - 开发笔记
tags:
    - webApi
    - audio
---

## 背景

解决了视频音频各种问题之后便迎来了下一个课题 - 分享页唤起 app

对于这个需求, 我首先想到的就是王光头大佬的一句吐槽.

![2021-07-19-11-56-00](https://handle-note-img.niubishanshan.top/2021-07-19-11-56-00.png)

![2021-07-13-10-34-26](https://handle-note-img.niubishanshan.top/2021-07-13-10-34-26.png)

可惜, 经过我一顿搜索. 目前内网相似功能的库都大多以唤起快手为主. 对于我们这种创新型部门自己的 app 没能完全覆盖业务场景. 于是, 在组内老鸟的指导下终于撸起袖子了 ~

![2021-07-19-14-30-20](https://handle-note-img.niubishanshan.top/2021-07-19-14-30-20.png)

## 各类唤端方案简介

经过了一系列的调研工作, 我们了解到目前还没有一种可以实现跨所有终端所有 app 的唤端方案. 根据不同的终端和 app 的限制, 目前常用的方案有以下几种:

- 弹出蒙层提示用户下载打开 app
- location + Scheme Url
- a 标签 + Scheme Url
- 微信开放标签 (微信 >= 7.0.12)
- universal link (iOS >= 9; iOS 微信 >= 7.0.7 放开限制)

### 弹出引导下载的弹窗

解决问题最直接的方法往往是简单的. 所以最初的方案就是弹个蒙层提示用户去 app 打开.

![2021-07-13-16-01-29](https://handle-note-img.niubishanshan.top/2021-07-13-16-01-29.png)

优点:
- 简单易行
- 快发体验好

缺点:
- 转化率低
- 用户体验不好

### location + Scheme Url

从[这篇文章](https://www.jianshu.com/p/fdc00c4fbb83)中, 我学习到了 location + Scheme Url 的唤端方案

```js
button.onclick = () => {
    location.href = 'imv://tab/feed'
}
```

![scheme](https://handle-note-img.niubishanshan.top/scheme.gif)

看到这个效果之后大大的松了一口气, 难怪没有大佬写过相关的库. 这么简单的一行代码, 写出来简直贻笑大方. 那么 `git push` 上线, 直到测试体验同学找过来:

A: 圈圈, 我在苹果手机 QQ 里点开分享页打不开 app 呀
B: 圈圈, 我在微信里点开分享页打不开 app 呀
C: 圈圈, 我在微博里点开分享页打不开 app 呀
D: 圈圈, 我在 Kim 里点开分享页打不开 app 呀, WTF
....

经测试, `location + Scheme Url` 唤端方案在目前只有在我的 Safari 浏览器上好使.

### a 标签 + Scheme Url

由于我们的产品的主要用户是年轻的朋友, 所以 QQ 的问题就显得很棘手. 于是, 在组里前端老鸟 @伟哥 的提示把 iOS QQ 环境下的唤端方案改成了 A 标签唤端的伪代码如下:

```js
const a = document.createElement('a')
a.style.display = 'none'
a.href = 'imv://tab/feed'
a.click()
```

修改后苹果手机 QQ 上的效果如下, 唤端成功

![tagA](https://handle-note-img.niubishanshan.top/tagA.gif)

经过上述两种方案, 我们实现了安卓 iOS 双端的系统浏览器和 QQ 上唤起 App 的能力. 但是面对 app 界的顶流微信还是无计可施.

### 微信开放标签

好在找到了[微信开放标签](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#22)的文档. 微信在 7.0.12 版本加入了微信开放标签. **认证的服务号** 可以通过在网页中添加微信开放标签实现唤端操作.

### universal link


渐进式

1. scheme -> location, iOS qq
2. 微信开放标签
3. universal Link
4. indent 测试了一下, 发现不好使
