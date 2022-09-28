---
title: github hosts 变快
date: 2022-09-27 18:53:00
categories:
    - Tips
tags:
    - github
---

到这个 <https://ipaddress.com/>, 分别搜索:

- github.global.ssl.fastly.net
- github.com
- assets-cdn.github.com

三个域名, 并复制搜索到的 ip 地址(ipv4)

然后构造 hosts 文件内容

xxx.xxx.xxx.xxx github.com

xxx.xxx.xxx.xxx assets-cdn.github.com

xxx.xxx.xxx.xxx github.global.ssl.fastly.net

复制到 `/etc/hosts` 文件中

最后, 刷新 dns 缓存 `sudo killall -HUP mDNSResponder;say DNS cache has been flushed`

亲测好使













