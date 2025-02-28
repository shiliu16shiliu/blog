---
title: minio配置S3
date: '2025-02-23 16:07:47'
head: []
outline: deep
sidebar: false
prev: false
next: false
---



# minio配置S3

## 只安装minio

### 步骤 1：更新容器内的系统

在容器内部，使用以下命令更新系统的软件包列表并升级现有软件包：

```nginx
apt update
apt upgrade -y
```

### 步骤 2：安装必要的依赖

MinIO 是一个用 Go 语言编写的高性能对象存储服务器，为了确保其正常运行，需要安装一些必要的依赖：

```nginx
apt install wget -y
```

### 步骤 3：下载并安装 MinIO 服务器

从 MinIO 官方网站下载最新的 MinIO 服务器二进制文件，并将其移动到系统的可执行路径中：

```nginx
# 下载 MinIO 服务器二进制文件
wget https://dl.min.io/server/minio/release/linux-amd64/minio

# 赋予可执行权限
chmod +x minio

# 将 MinIO 移动到系统可执行路径
mv minio /usr/local/bin/
```

### 步骤 4：创建 MinIO 数据目录

为了存储 MinIO 的数据，你需要创建一个专门的目录：

```nginx
mkdir -p /data/minio
```

### 步骤 5：配置 MinIO 环境变量

MinIO 使用环境变量来配置访问密钥和秘密密钥，你可以通过以下方式设置这些变量：

```nginx
# 设置 MinIO 的根用户和密码
export MINIO_ROOT_USER=root
export MINIO_ROOT_PASSWORD=Nihao@123
```

<font style="color:rgba(0, 0, 0, 0.85);">为了使这些环境变量在容器重启后仍然有效，你可以将它们添加到 </font>`<font style="color:rgba(0, 0, 0, 0.85);">/etc/profile</font>`​<font style="color:rgba(0, 0, 0, 0.85);"> 文件中：</font>

```nginx
echo 'export MINIO_ROOT_USER=root' >> /etc/profile
echo 'export MINIO_ROOT_PASSWORD=Nihao@123' >> /etc/profile
source /etc/profile
```

### 步骤 6：启动 MinIO 服务器

使用以下命令启动 MinIO 服务器，指定数据存储目录和监听地址：

```nginx
minio server /data/minio --address ":9000" --console-address ":9001"
```

### 步骤 7：设置 MinIO 为系统服务（可选）

为了在容器启动时自动启动 MinIO 服务器，你可以将其设置为系统服务。创建一个 `minio.service`​ 文件：

```nginx
cat << EOF > /etc/systemd/system/minio.service
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target

[Service]
Environment="MINIO_ROOT_USER=root"
Environment="MINIO_ROOT_PASSWORD=Nihao@123"
ExecStart=/usr/local/bin/minio server /data/minio --address ":9000" --console-address ":9001"
Restart=always
User=root
Group=root
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

```nginx
# 重新加载 systemd 管理器配置
systemctl daemon-reload

# 启动 MinIO 服务
systemctl start minio

# 设置 MinIO 服务开机自启
systemctl enable minio
```

‍

## lxc安装minio并且挂载smb作为存储

### 1. 更新系统并安装必要的软件包

在容器内，更新系统软件包列表并安装必要的软件，包括 `cifs-utils` 用于挂载 SMB 共享，以及 `wget` 用于下载 MinIO：

```nginx
# 更新软件包列表
apt update

# 安装必要的软件包
apt install -y cifs-utils wget
```

### 2. 挂载 SMB 共享

在挂载 SMB 共享之前，你需要准备好 SMB 服务器的相关信息，如服务器地址、共享名称、用户名和密码。以下是挂载 SMB 共享的步骤：

```nginx
# 创建一个用于挂载 SMB 共享的目录
mkdir /mnt/smb_share

# 使用 mount.cifs 命令挂载 SMB 共享
# 请将 //smb_server_address/share_name 替换为实际的 SMB 共享地址
# 将 username 和 password 替换为实际的用户名和密码
mount.cifs //192.168.50.27/十六/minio_data /mnt/smb_share -o username=ms,password=meiyoumima123

#不用，这是创建webdav服务的时候用的，这儿用不到
//192.168.50.27/十六/webdav /var/www/webdav cifs username=ms,password=meiyoumima123,rw 0 0

# 可以通过以下命令检查挂载是否成功
df -h
```

### 3. 下载并安装 MinIO

从 MinIO 官方网站下载 MinIO 服务器二进制文件，并将其安装到系统中：

```nginx
# 下载 MinIO 服务器二进制文件
wget https://dl.min.io/server/minio/release/linux-amd64/minio

# 赋予可执行权限
chmod +x minio

# 将 MinIO 移动到 /usr/local/bin 目录
mv minio /usr/local/bin/
```

### 4. 配置 MinIO

创建一个用于存储 MinIO 配置和数据的目录，并设置 MinIO 的访问密钥和秘密密钥：

```nginx
# 创建 MinIO 数据目录
mkdir /mnt/smb_share/minio_data

# 设置 MinIO 的根用户和密码
export MINIO_ROOT_USER=root
export MINIO_ROOT_PASSWORD=Nihao@123
```

### 5. 启动 MinIO 服务器

使用挂载的 SMB 共享目录作为 MinIO 的数据存储位置启动 MinIO 服务器：

```nginx
# 启动 MinIO 服务器，指定数据目录为挂载的 SMB 共享目录
minio server /mnt/smb_share/minio_data
```

### 6. 配置 MinIO 服务（可选）

为了在系统启动时自动启动 MinIO 服务器，你可以创建一个 systemd 服务文件：

```plaintext
cat << EOF > /etc/systemd/system/minio.service
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target

[Service]
Environment="MINIO_ROOT_USER=root"
Environment="MINIO_ROOT_PASSWORD=Nihao@123"
ExecStart=/usr/local/bin/minio server /data/minio --address ":9000" --console-address ":9001"
Restart=always
User=root
Group=root
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

```nginx
# 重新加载 systemd 管理器配置
systemctl daemon-reload

# 启动 MinIO 服务
systemctl start minio

# 设置 MinIO 服务开机自启
systemctl enable minio
```

​![](https://raw.githubusercontent.com/shiliu16shiliu/blog/master/images/1740248555049-e9aa0b4b-248f-43ba-bcec-33ac926babbf.png)​

‍
