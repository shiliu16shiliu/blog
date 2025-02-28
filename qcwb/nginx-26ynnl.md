---
title: Nginx
date: '2025-02-23 18:42:00'
head: []
outline: deep
sidebar: false
prev: false
next: false
---



# Nginx

## 1.nginx开启传递包含“\_”参数

### 介绍

nginx代理默认会把header中参数的 "\_" 下划线去掉，所以后台服务器后就获取不到带"\_"线的参数名。

```plain
underscores_in_headers on; #该属性默认为off，表示如果header name中包含下划线，则忽略掉。
```

​![image](assets/image-20250223190222-vcqvfbn.png)​

## 2.定时清空access.log或error.log日志

### 1.离线安装crontab定时任务

1.下载crontabs-1.11-6.20121102git.el7.noarch.rpm

[https://centos.pkgs.org/7/centos-x86_64/crontabs-1.11-6.20121102git.el7.noarch.rpm.html](https://centos.pkgs.org/7/centos-x86_64/crontabs-1.11-6.20121102git.el7.noarch.rpm.html)

[http://mirror.centos.org/centos/7/os/x86_64/Packages/crontabs-1.11-6.20121102git.el7.noarch.rpm](http://mirror.centos.org/centos/7/os/x86_64/Packages/crontabs-1.11-6.20121102git.el7.noarch.rpm)

```plain
执行命令
rpm -ivh crontabs-1.11-6.20121102git.el7.noarch.rpm
```

### 2.创建任务计划

```plain
$ mkdir /opt/cleanlog
$ vim /opt/cleanlog/clean-nginxlog.sh

#!/bin/bash
#此脚本用于自动分割指定目录的日志，包括access_log和error_log
#每天00:00执行此脚本 将前一天的access_log拷贝为access_log-xxxx-xx-xx格式，并清空已拷贝的日志文件
#日志目录
LOG_PATH=/usr/local/nginx/logs
#获取昨天的日期
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
#分割日志
for a in ` find  ${LOG_PATH} -name "access.log" `;do cp $a $a-${YESTERDAY};echo ""  >$a;done
for e in ` find  ${LOG_PATH} -name "*error.log" `;do cp $e $e-${YESTERDAY};echo ""  >$e;done
#删除7天前日志
find ${LOG_PATH} -mtime +7 -type f -name "*log-*" -exec rm -f {} \;

添加Linux计划任务
crontab -e
创建定时任务每天凌晨清空
0 0  * * * /opt/cleanlog/clean-nginxlog.sh

重启crond服务
systemctl restart crond

查看任务计划
crontab -l
```

### 3.在线校验工具

[https://tool.lu/crontab/](https://tool.lu/crontab/)

‍
