---
title: lxc容器安装思源笔记
date: '2025-02-23 18:49:04'
head: []
outline: deep
sidebar: false
prev: false
next: false
---



# lxc容器安装思源笔记

### lxc容器配置

打开目录/etc/pve/lxc中的你的lxc容器编号.conf，然后在最下面加上以下几行。

可以将基础配置好的lxc容器转换为模版，以后直接克隆模版即可。

```nginx
lxc.apparmor.profile: unconfined
lxc.cgroup2.devices.allow: c 226:0 rwm
lxc.cgroup2.devices.allow: c 226:128 rwm
lxc.mount.entry: /dev/dri dev/dri none bind,optional,create=dir

分别的含义是
关闭apparmor，不然根本用不了docker
允许容器访问226:0设备，就是核显
允许容器访问访问226:128设备，还是核显，应该是是渲染器
将主机里面的/dev/dri目录挂载到容器内，如果主机不存在就不挂载，如果容器没这个目录就新建，注意后面这个dev前面没有斜杠
```

### 换源

修改/etc/docker/daemon.json，换源，不然下载不了

```nginx
{
    "insecure-registries": [
        "nexus.uict.com:11100"
    ],
    "dns": [
        "8.8.8.8"
    ],
    "registry-mirrors": [
        "https://docker.registry.cyou",
        "https://docker-cf.registry.cyou",
        "https://dockercf.jsdelivr.fyi",
        "https://docker.jsdelivr.fyi",
        "https://dockertest.jsdelivr.fyi",
        "https://mirror.aliyuncs.com",
        "https://dockerproxy.com",
        "https://mirror.baidubce.com",
        "https://docker.m.daocloud.io",
        "https://docker.nju.edu.cn",
        "https://docker.mirrors.sjtug.sjtu.edu.cn",
        "https://docker.mirrors.ustc.edu.cn",
        "https://mirror.iscas.ac.cn",
        "https://docker.rainbond.cc",
        "https://do.nark.eu.org",
        "https://dc.j8.work",
        "https://dockerproxy.com",
        "https://gst6rzl9.mirror.aliyuncs.com",
        "https://registry.docker-cn.com",
        "http://hub-mirror.c.163.com",
        "http://mirrors.ustc.edu.cn/",
        "https://mirrors.tuna.tsinghua.edu.cn/"
    ],
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": [

            ]
        }
    },
    "exec-opts": [
        "native.cgroupdriver=cgroupfs"
    ],
    "experimental": true
}
```

### 拉取思源笔记镜像

```plaintext
docker pull b3log/siyuan
```

‍

### 启动思源笔记服务

```nginx
sudo docker run -d \
  -v /siyuan/workspace:/siyuan/workspace \
  -p 6806:6806 \
  -p 6808:6808 \
  -e PUID=1001 \
  -e PGID=1002 \
  b3log/siyuan \
  --workspace=/siyuan/workspace/ \
  --accessAuthCode=woshishiliu
```

### 重启服务

```nginx
# 重新加载
systemctl daemon-reload

# 重启docker
systemctl restart docker
```

‍

### 将思源笔记配置为https,生成证书

```nginx
1. 安装 OpenSSL
sudo apt-get install openssl
2. 创建私钥文件（.key
sudo openssl genpkey -algorithm RSA -out server.key -pkeyopt rsa_keygen_bits:2048
3. 创建证书签名请求（CSR）
sudo openssl req -new -key server.key -out server.csr
4. 生成自签名证书（.crt）
sudo openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 36500

```

‍

### 安装nginx

```plaintext
# 更新包列表
apt-get update
# 安装nginx
apt-get install nginx
# 启动nginx
service nginx start
```

### 配置nginx

/etc/nginx/conf/conf.d/

新增vim shiliu.conf

```nginx
server {
    listen 80;
    server_name localhost;

    return 301 https://$host$request_uri;
}

server {
    listen       443 ssl;
    server_name  localhost;

    ssl_certificate "/opt/nginxcert/server.crt";
    ssl_certificate_key "/opt/nginxcert/server.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://192.168.50.50:6806;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'Upgrade';
        client_max_body_size 100m;
    }
}

server {
    listen       8002 ssl;
    server_name  localhost;

    ssl_certificate "/opt/nginxcert/server.crt";
    ssl_certificate_key "/opt/nginxcert/server.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://192.168.50.50:6808;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'Upgrade';
        client_max_body_size 100m;
    }
}

server {
    listen       8003 ssl;
    server_name  localhost;

    ssl_certificate "/opt/nginxcert/server.crt";
    ssl_certificate_key "/opt/nginxcert/server.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://192.168.50.50:9000;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'Upgrade';
        client_max_body_size 100m;
    }
}

server {
    listen       8004 ssl;
    server_name  localhost;

    ssl_certificate "/opt/nginxcert/server.crt";
    ssl_certificate_key "/opt/nginxcert/server.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://192.168.50.50:9001;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'Upgrade';
        client_max_body_size 100m;
    }
}
```
