---
title: 美化 next 主题
date: 2020-02-06 21:50:31
categories:
  - Blog
tags:
  - hexo
---

## 自己 fork 一份 next 项目, 作为博客项目的 sub-moudle

### 初始化步骤

- fork 官方的 `https://github.com/theme-next/hexo-theme-next` 并更名为 `quanquan-hexo-theme-next`
- 清空 `themes` 目录下的所有主题文件
- 执行 `git submodule add https://github.com/luoquanquan/quanquan-hexo-theme-next.git themes/next` 将 `fork` 来的 next 主题项目作为 `submodule` 添加到博客项目下
- 此时执行 `hexo s` 就可以看到 next 主题的页面啦

<!-- more -->

### 将主题项目作为子模块的目的

直接 clone 三方的主题, 可以默认直接用, 但是如果想要基于其进行配置就 gg 了, 之前文章中提到过原生的 next 并不是很好看. 我们要修改主题的配置, 注定要修改主题项目的代码, 但是对于三方的主题项目肯定没有提交的权限, 所以只能 fork 一份自己维护. 可以保存自己的配置实现跨多端的文档编写.

### 其他终端导入相同配置的主题文件

使用 git clone 是不会克隆 submodule 的, 克隆主的博客项目后还需要执行
- git submodule init 初始化本地配置文件
- git submodule update 从该项目中抓取所有数据并检出父项目中列出的合适的提交

也可在 clone 使用 git clone --recursive 命令, git 就会自动初始化并更新仓库中的每一个子模块

### 获取主题项目的更新

若子分支仓库中有未同步的更新, 可通过 `git submodule update --remote --rebase` 来同步最新的内容. 之后便可以打开编辑器在子模块上工作修改代码了.

主题作者发布了新的主题功能或者修复了 bug, 我们想同步到自己的自定义主题当中. 因为我们的自定义主题是从原主题中 fork 出来的, 可以通过 `git remote add source https://github.com/theme-next/hexo-theme-next` 命令将源主题仓库添加为子模块的 一个新的 source 仓库. 然后运行 `git fetch` 拉取修改后, 便可以通过 `git merge origin/master` 来同步源主题的更新了

## 自定义 next 主题配置

一个 hexo 博客项目中存在两个 `_config.yml` 配置文件, 项目更目录的 `_config.yml` 文件称为 **站点配置文件**, 主题根目录下的 `_config.yml` 文件称为 **主题配置文件**

### 菜单设置

> 菜单包括: home tags categories archives about schedule sitemap commonweal

默认 next 开启的菜单只有 home 和 archives 两个, 若要打开更多的菜单, 打开 **主题配置文件** 找到 `# Menu Settings`

```yml
menu:
  home: / || home
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  about: /about/ || user
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```

按照如上的方式修改即可.

解释`home: / || home` 其中 `||`左边的 `/` 表示的是当前 menu 对应的路径, 右边的 home 表示的是 icon, 这个的制作和修改参考[fontawesome](https://fontawesome.com/icons)

### next 主题的样式设置

next 主题提供了四种样式, 总体来说大同小异, 修改的方式是在 **主题配置文件** 中找到`# Scheme Settings`

```yml
# Schemes
# scheme: Muse
#scheme: Mist
# scheme: Pisces
scheme: Gemini
```

### 侧边栏调整

```yml
sidebar:
# Sidebar Position - 侧栏位置（只对Pisces | Gemini两种风格有效）
  position: left        //靠左放置
  #position: right      //靠右放置

# Sidebar Display - 侧栏显示时机（只对Muse | Mist两种风格有效）
  #display: post        //默认行为，在文章页面（拥有目录列表）时显示
  display: always       //在所有页面中都显示
  #display: hide        //在所有页面中都隐藏（可以手动展开）
  #display: remove      //完全移除

  offset: 12            //文章间距（只对Pisces | Gemini两种风格有效）

  b2t: false            //返回顶部按钮（只对Pisces | Gemini两种风格有效）

  scrollpercent: true   //返回顶部按钮的百分比
```

### 设置博客头像

在 **主题配置文件** 中找到 `# Sidebar Avatar` 字段

```yml
avatar:
  # Replace the default image and set the url here.
  url: /images/avatar.jpeg
```

url 对应的就是头像的路径, 只要把图片放到主题项目下的 `source/images` 目录下, hexo 就能默认就能找到

### 添加分类模块

- 新建一个页面 `hexo new page categories`, 会在 `source` 目录下创建 `categorcies/index.md` 该文件内标注了文件 `title` 为 `categorcies`, 将其修改为 `分类`
- 打开 **主题配置文件** 找到 `menu` 删除 `categories: /categories/ || th` 前的注释
- 在文章顶部的文章头信息区域添加 `categories` 并设置为要将文章设置的分类名, `hexo` 就会自动把文章划分到指定的分类中

### 添加标签模块

- 新建一个页面 `hexo new page tags`, 会在 `source` 目录下创建 `tags/index.md` 该文件内标注了文件 `title` 为 `tags`, 将其修改为 `标签`
- 打开 **主题配置文件** 找到 `menu` 删除 `tags: /tags/ || tags` 前的注释
- 在文章顶部的文章头信息区域添加 `tags` 并设置为要将文章设置的分类名, `hexo` 就会自动把文章划分到指定的分类中

eg:

```markdown
---
title: 美化 next 主题
date: 2020-02-06 21:50:31
categories:
  - Blog
tags:
  - hexo
---

## 自己 fork 一份 next 项目, 作为博客项目的 sub-moudle

```

`hexo` 会自动创建 `Blog` 分类和 `hexo` 标签, 并为当前的文章添加两个属性

### 添加关于模块

- 新建一个页面 `hexo new page about`, 会在 `source` 目录下创建 `about/index.md` 该文件就是你写简历的地方啦~
- 打开 **主题配置文件** 找到 `menu` 删除 `about: /about/ || user` 前的注释

### 添加搜索功能

- 安装 [hexo-generator-searchdb](https://www.npmjs.com/package/hexo-generator-searchdb) 插件 `npm i hexo-generator-searchdb`
- 在 **站点配置文件** 的最下方添加
```yml
# 搜索
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```
- 在 **主题配置文件** 中找到 `Local search`, 将 `enable` 设置为 `true`

### 设置网站的 favicon

把想要设置为 `favicon` 的图片放到 `themes/next/source/images`, 然后在 **主题配置文件** 中找到 `favicon` 一口气全给他改了
```yml
favicon:
  small: /images/favicon.png
  medium: /images/favicon.png
  apple_touch_icon: /images/favicon.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```
其中, `/images/favicon.png` 就是你要设置为 `favicon` 的图片.

### 自定义文字大小 & 颜色

```yml
<font color="red">红色的文字</font>

<font size=60>大文字比你大</font>

<font size=5 color="#FF0000">小文字比你小, 但是比你有营养</font>

<center>我可以居中</center>
```

<font color="red">红色的文字</font>

<font size=60>大文字比你大</font>

<font size=5 color="#FF0000">小文字比你小, 但是比你有营养</font>

<center>我可以居中</center>

### 修改超链接文本样式

在 `themes/next/source/css/_common/components/post/post.styl` 样式文件末尾添加:

```css
.post-body p a {
  color: #0593d3;
  border-bottom: none;
  border-bottom: 1px solid #0593d3;
  &:hover {
    color: #fc6423;
    border-bottom: none;
    border-bottom: 1px solid #fc6423;
  }
}
```

### 在右上角或者左上角实现fork me on github

- 首先到[这里](http://tholman.com/github-corners/)或者[这里](https://github.blog/2008-12-19-github-ribbons/) 挑选自己喜欢的 fork me 样式, 并复制相关的代码
- 然后粘贴刚才复制的代码到 `themes/next/layout/_layout.swig`文件中 (放在`<div class="headband"></div>`的下面), 并把 href 改为你的 github 地址

eg:
```html
    <div class="headband"></div>
    <a href="https://github.com/luoquanquan" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
    <header class="header" itemscope itemtype="http://schema.org/WPHeader">
      <div class="header-inner">{% include '_partials/header/index.swig' %}</div>
    </header>
```

### 添加 RSS

#### 配置

- 执行 `npm i hexo-generator-feed`
- 打开 **站点配置文件** 并在文件 `Extensions` 下方添加如下代码
```yml
# RSS
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
```
- 打开 **主题配置文件** 找到 `# Sidebar Settings` 下的 `# Social Links` 打开 `RSS: /atom.xml || rss` 前边的注释即可
- 最后重新生成一次文章静态网站, 能发现新的网站中添加了 `atom.xml` 部署到网站到服务器
- 通过浏览器访问博客网站, 社交链接的位置出现 `RSS` 说明配置成功
![2020-02-08-15-16-51](https://handle-note-img.niubishanshan.top/2020-02-08-15-16-51.png)

#### 使用

- 打开一个 `rss reader` 的网站, 比如 [这个](https://feedreader.com/)
- 注册一个账户, 进入网站
- 点击 `Add a new feed` 按钮
![2020-02-08-15-13-13](https://handle-note-img.niubishanshan.top/2020-02-08-15-13-13.png)
- 点击配置步骤中加入的 `RSS` 按钮, 浏览器会跳转到一个 xml 文档的地址, 此时复制浏览器 url, 并粘贴到 `Address` 的输入框中
![2020-02-08-15-18-43](https://handle-note-img.niubishanshan.top/2020-02-08-15-18-43.png)
- 待阅读器识别到你的博客 title 的时候点击 `Add the feed` 即可
- enjoy

### 添加动态背景

- 打开 **主题配置文件** 找到 `# Canvas-nest` 并修改, `canvas_nest` 的 `enable` 属性为 `true`
- 找到 `canvas_nest` 和 `canvas_nest_nomobile` 两个字段, 打开两个字段前的注释, 也可以像我一样, 把两个 js 文件 copy 到项目目录下以提升稳定性
- 重新打包 & 部署
- enjoy

### 博文压缩

- 安装 gulp
```bash
npm install gulp -g
npm install gulp-minify-css gulp-uglify-es gulp-htmlmin gulp-htmlclean gulp -D
```
- 创建 `gulpfile.js` 内容参考[这里](https://github.com/luoquanquan/handle-note/blob/master/gulpfile.js)
- 修改 `npm script` 为 `"build": "hexo g && gulp"` 每次编译完成后都执行下 gulp 用于压缩文件
- enjoy

### 在网站底部加上访问量

在 **项目配置文件** 中找到 `busuanzi_count` 将 enable 属性设置为 true 即可

### 添加博文字数统计

- 执行 `npm i hexo-symbols-count-time` 安装插件
- 字数统计能力自动就激活了
- enjoy

### 修改文章访问路径

默认的文章访问路径中包含了写作日期, 很不好. 打开 **站点配置文件** 修改 `permalink` 字段
```yml
permalink: :category/:title/
```

### 隐藏网页底部powered By Hexo / 强力驱动

```yml
powered:
  # Hexo link (Powered by Hexo).
  enable: false
  # Version info of Hexo after Hexo link (vX.X.X).
  version: false
```

## 参考资料

- [hexo的next主题个性化教程:打造炫酷网站](https://www.jianshu.com/p/f054333ac9e6)
- [Hexo的Next主题详细配置](https://www.jianshu.com/p/3a05351a37dc)
- [在 hexo 中使用 git submodules 管理主题](https://juejin.im/post/5c2e22fcf265da615d72c596)
- [Git 工具 - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)


