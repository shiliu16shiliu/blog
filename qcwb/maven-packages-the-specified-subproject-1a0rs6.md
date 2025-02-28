---
title: Maven 打包指定子项目
date: '2025-02-23 18:35:35'
head: []
outline: deep
sidebar: false
prev: false
next: false
---



# Maven 打包指定子项目

最近使用spinnaker打包，项目越来越多，打包越来越慢，考虑是不是有只针对于子项目的打包方法

资料引用：[https://www.cnblogs.com/wandoupeas/p/maven_part_package.html](https://www.cnblogs.com/wandoupeas/p/maven_part_package.html)

```plain

mvn clean package -pl 子模块名 -am

参数说明：
-am --also-make 同时构建所列模块的依赖模块；
-amd -also-make-dependents 同时构建依赖于所列模块的模块；
-pl --projects 构建制定的模块，模块间用逗号分隔；
-rf -resume-from 从指定的模块恢复反应堆。

例如：
mvn clean package install '-Dmaven.test.skip=true' -pl sys-common,demo
```
