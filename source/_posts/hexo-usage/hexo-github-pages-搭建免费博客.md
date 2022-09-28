---
title: hexo & github pages 搭建免费博客
date: 2020-02-06 00:50:31
categories:
  - Blog
tags:
  - hexo
  - github pages
---

> Blog 系列文章不会对外发布, 多数情况是分享给以后的自己, 所以默认读者为高级前端工程师啦~

## 项目背景

本文即将创建的博客系统基于 [hexo](https://hexo.io/), 博客托管平台为 [github](https://github.com/), 基于 [github pages](https://pages.github.com/) 实现 hexo 生成的静态文件的托管能力, 默认读者已经对以上三者有一定的了解...

<!-- more -->

## 准备工作

- 首先, 到 github 创建一个空的仓库命名为 `handle-note`

![2020-02-06-00-10-23](https://handle-note-img.niubishanshan.top/2020-02-06-00-10-23.png)

- 其次, 安装 hexo-cli `npm install hexo-cli -g`
- 最后, 在你喜欢的目录下执行 `hexo init handle-note` 名字只是为了和 github 项目名字一样, 完成博客项目的初始化

## 关联本地项目和远程项目

hexo 项目初始化完成后, 进入项目目录并执行以下命令, 完成初始化项目的 git 处理

```bash
git init
git commit -m "hexo init"

# 注意, 实际使用的时候这里的 luoquanquan 要变成你自己的用户名
git remote add origin git@github.com:luoquanquan/handle-note.git
git push -u origin master
```

到了这一步, 就完成了初始化项目的构建

## 修改配置文件生成目录为 docs

打开项目目录下的 `_config.yml` 文件, 找到 `# Directory` 下的 `public_dir: public` 字段, 把 `public` 改为 `docs`

## 生成 blog 项目, 并 push 代码

- 执行 `hexo g` 生成静态博客网站
- 将生成的 `docs` 目录的所有内容推送到远程

## 启动 github pages

- 点击项目设置
![2020-02-06-01-24-33](https://handle-note-img.niubishanshan.top/2020-02-06-01-24-33.png)
- 在项目设置中的 github pages 栏目 Source 选项卡选择 master branch /docs folder
![2020-02-06-01-25-54](https://handle-note-img.niubishanshan.top/2020-02-06-01-25-54.png)
- 访问  `luoquanquan.github.io/handle-note/` 查看效果发现样式乱掉了
![2020-02-06-01-29-02](https://handle-note-img.niubishanshan.top/2020-02-06-01-29-02.png)

## 修改 blog 站点路径

打开 `_config.yml` 文件, 找到 `# URL` 下的 `root: /` -> `root: /handle-note/`
再次, 打包 -> push

然后访问 `luoquanquan.github.io/handle-note/`
![2020-02-06-01-41-31](https://handle-note-img.niubishanshan.top/2020-02-06-01-41-31.png)

配置完成, 由于 docs 项目在主体项目中, 方便的实现了博客项目的版本管理能力
