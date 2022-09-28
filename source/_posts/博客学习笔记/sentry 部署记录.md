---
title: sentry 部署记录
date: 2020-11-13 13:50:31
categories:
  - 工程化
tags:
  - docker
  - sentry
---

## 安装 docker

执行命令, 一键安装

```bash
curl -sSL https://get.daocloud.io/docker | sh
```

## 安装 docker-compose

- 利用国内镜像安装 `docker-compose` 实测秒下
    ```bash
    curl -L "https://get.daocloud.io/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    ```

- 设置可运行
    ```bash
    chmod +x /usr/local/bin/docker-compose
    ```

ps: 如果没有执行这个命令的话, 使用 `docker-compose` 命令会报 `Permission Denied`

## 配置阿里云加速器

访问[阿里云镜像网址](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors?spm=5176.12901015.0.i12901015.76b5525caiPyWb)

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://r3tdolb4.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 安装 git

```bash
yum install git -y
```

## 获取 sentry

- 访问[onpremise](https://github.com/luoquanquan/onpremise.git)
- `git clone https://github.com/luoquanquan/onpremise.git`
- `git checkout bjh-sentry` 切换到项目专用分支
- 执行 `./install.sh`, 安装 `sentry`

安装过程中会提示是否创建管理员的邮箱. 可以这会儿创建, 也可以安装完成以后再创建. 安装完成后, 使用命令 `docker-compose up` 就可以启动 sentry. 访问 {IP:9000} 可以访问到相关内容.

## 安装 nginx

- 执行 `yum install nginx -y` 在宿主机安装 `nginx`
- 修改 `nginx.conf`(默认路径 `/usr/nginx/nginx.conf`)
- 把 `sentry` 对应的域名指向本地 `9000` 端口号
- well done

`nginx` 默认限制的可上传文件大小是 `1m`, 但是项目中稍微大一点的 `sourceMap` 文件就会超出限制报 `413` 请求包体过大的错误. 需要在 nginx 配置文件 `http` 配置中添加 `client_max_body_size 50m;` 就行了...

## sentry 后台管理页面限制内网访问

正常情况下, 判断内网直接使用 `nginx` 内置变量 `$remote_addr` 即可, 我们这里由于使用的环境是集群的环境, 所以需要判断的是 `$proxy_add_x_forwarded_for`, 在 `nginx/nginx.conf` 文件中添加一下内容.

```nginx
location / {
    if ($proxy_add_x_forwarded_for !~* ^111\.206\.214\.28.*) {
        add_header Content-Type "text/plain; chartset=utf-8";
        return 200 "you don't have access to visit this app, please contact the Administrator ~"
    }

    proxy_pass http://sentry;
}
```

sentry 运行一段时间后, 服务器磁盘炸了 💥

## 日志迁移

因为之前的 `nginx` 和 `sentry` 日志都是写到系统盘上, 事件变多的时候上报变多最终导致了磁盘挤满, 所以想到了将日志信息迁移到数据盘上(相对容量大一些)

由于 `sentry` 是通过 `docker` 启动起来的, 所以需要持久化的东西肯定是通过 `volume` 到宿主机的. 那么把 `volume` 路径修改到数据盘就 OK?

修改 `docker` 默认路径可以用 [参考文档](https://zhuanlan.zhihu.com/p/95533274) 中的方法

也可以用以下步骤:

- `systemctl stop docker`
- `vim /usr/lib/systemd/system/docker.service`
- 找到 `EXECStart` 并在后边添加 `ExecStart=/usr/bin/dockerd --graph /mnt/local/docker`
![2021-01-08-12-04-14](https://handle-note-img.niubishanshan.top/2021-01-08-12-04-14.png)

- `systecmtl daemon-reload`
- `systemctl start docker`

## 日志清理

### sentry 清理

```bash
# 登陆 sentry_worker_1 容器
$ docker exec -it sentry_worker_1 bash

# 保留 0 天数据, cleanup的使用 delete 命令删除 postgresql 数据，但 postgrdsql 对于delete, update 等操作, 只是将对应行标志为 DEAD, 并没有真正释放磁盘空间
$ sentry cleanup  --days 0

# 登陆 sentry_postgres_1 容器
$ docker exec -it sentry_postgres_1 bash

# 运行清理
$ vacuumdb -U postgres -d postgres -v -f --analyze
```

### nginx 日志清理

通过 `nginx -t` 找到当前 `nginx` 配置文件, 并找到日志落盘的位置

如果不想保留 `nginx` 日志文件可以按照下边的方法直接清除所有的日志

```bash
#!/bin/bash
mv /mnt/log/nginx/access.log /mnt/log/nginx/access.log.bak
mv /mnt/log/nginx/error.log /mnt/log/nginx/error.log.bak
/sbin/nginx -s reopen
rm -rf  /mnt/log/nginx/access.log.bak
rm -rf  /mnt/log/nginx/error.log.bak
```

如果想要保留日志文件可以使用下边的方法(需要配合定时任务)

```bash
#!/bin/bash
# 复制日志文件
cp /mnt/log/nginx/error.log /mnt/log/nginx/error-$(date -d "yesterday" +"%Y%m%d").log
cp /mnt/log/nginx/access.log /mnt/log/nginx/access-$(date -d "yesterday" +"%Y%m%d").log
# 清空日志文件
cat /dev/null > /mnt/log/nginx/error.log
cat /dev/null > /mnt/log/nginx/access.log

# 删除 3 天前的日志文件
find /usr/local/nginx/logs -mtime 3 -type f -name \*.log | xargs rm -rf
```

## 定时清理日志

### 编写清理脚本

- 创建 `clear-tools` 并进入该目录
- 创建 `sentry-clear.sh` 并写入以下内容
    ```bash
    #!/bin/bash
    docker exec -it cc67cb44a5de sentry cleanup --days 0 && docker exec -it 7f7b67da4eae vacuumdb -U postgres -d postgres -v -f --analyze
    ```
- 创建 `nginx-log-clear.sh` 并写入以下内容
    ```bash
    #!/bin/bash
    mv /mnt/log/nginx/access.log /mnt/log/nginx/access.log.bak
    mv /mnt/log/nginx/error.log /mnt/log/nginx/error.log.bak
    /sbin/nginx -s reopen
    rm -rf  /mnt/log/nginx/access.log.bak
    rm -rf  /mnt/log/nginx/error.log.bak
    ```
- 执行 `chmod +x /mnt/clear-tools` 为脚本目录添加执行权限

### 添加定时任务

执行 `crontab -e` 并写入以下内容, 之后保存退出

```bash
0 0 * * * /mnt/clear-tools/nginx-log-clear.sh
0 0 * * * /mnt/clear-tools/sentry-clear.sh
```

添加完成后可以通过 `crontab -l` 查看调度计划

![2021-01-08-11-38-58](https://handle-note-img.niubishanshan.top/2021-01-08-11-38-58.png)

### 重启 crond 服务

```bash
/sbin/service crond restart
```

## 参考文档

- [Docker 修改默认存储路径的一个方法](https://www.cnblogs.com/jinanxiaolaohu/p/8301786.html)
- [修改 Docker 的默认存储路径](https://zhuanlan.zhihu.com/p/95533274)
