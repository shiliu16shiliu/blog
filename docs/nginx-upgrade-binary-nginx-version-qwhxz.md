---
title: Nginx:升级二进制nginx版本
date: '2025-02-27 12:37:16'
head: []
outline: deep
sidebar: false
prev: false
next: false
---



# Nginx:升级二进制nginx版本

升级二进制nginx版本，并添加模块

#### **1. 备份现有配置**

在操作之前，**务必备份现有的 Nginx 配置和二进制文件**：

```undefined
# 备份配置文件
cp -r /usr/local/nginx /opt/nginx/nginx_backup
```

### 2 **. 推荐的安全操作步骤**

#### **1. 下载 Nginx 源码**

```undefined
wget http://nginx.org/download/nginx-<version>.tar.gz
tar -zxvf nginx-<version>.tar.gz
cd nginx-<version>
```

#### **2. 添加健康检查模块**

```undefined
git clone https://github.com/zhouchangxun/ngx_healthcheck_module.git
```

‍

‍

‍

#### 3 **. 检查现有模块**

查看当前 Nginx 的编译参数，确保新编译的 Nginx 包含所有需要的模块：

```undefined
nginx -V

例如输出
--prefix=/usr/local/nginx --with-stream --with-http_ssl_module --with-stream_ssl_preread_module --with-stream_ssl_module
```

#### 4 **.** 配置编译参数使用

 nginx -V 查看现有编译参数，并添加到 ./configure 命令中。例如：

```undefined
./configure \
    --add-module=../ngx_healthcheck_module \
    --with-stream \
    --with-http_ssl_module \
    --with-stream_ssl_preread_module \
    --with-stream_ssl_module \
    --with-http_stub_status_module \
    --prefix=/usr/local/nginx
```

‍

‍

#### 5 **. 编译并安装**

```undefined
make
sudo make install
```

#### 6 **. 测试新版本**

在生产环境操作之前，**先在测试环境验证**：

1.在测试环境中编译和安装新版本 Nginx。

2.测试所有功能，确保没有兼容性问题。

```undefined
nginx -V
```

#### 7 **. 使用 Reload 代替 Restart**

安装完成后，使用 `nginx -s reload`​ 重新加载配置，而不是 `nginx -s restart`​，以减少服务中断时间。

```undefined
sudo nginx -s reload
```
