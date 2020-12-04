# 全方位入门 Git

## 为什么做这门课程

* 工作必备技能
* 面试加分项

## Git 的安装

`git --version` 检测当前电脑有没有安装 Git。

进入 [Git 官网](https://git-scm.com/)，找对应的平台下载。

Windows 下安装后，右键有 `Git GUI Here` 和 `Git Bash Here` 两个菜单，则安装成功。

## GitHub 简介及账号注册

关于 GitHub：

* 全球范围内最大的代码托管网站：可以用它来托管我们的代码；
* 全球范围内最大的代码开源网站：可以搜到众多且著名的开源项目；
* 是我们结交志同道合的研发朋友的重要渠道；

进入 [GitHub 首页](https://github.com/) 进行注册登录。

## 仓库的概念以及如何创建仓库

仓库：用来管理项目，一个项目一个仓库。

可以进行哪些方面的管理？

* 项目代码管理，无论是单人或是多人协作
* 项目进度管理，有代码提交的时间线
* 可以把项目代码暴露出去，这样他人可以把仓库的代码拷贝下来，学习、扩展或是帮助共同开发

在 Repositories 栏目中点击 New 按钮来创建仓库。

## 上传代码至 Github

在 `.gitignore` 文件中列出提交时忽略的目录及文件 -> 不纳入版本控制

`git init`：初始化一个 Git 仓库。之后可以查看项目目录下的隐藏文件。

`git add .`

`git commit -m 第一次提交`

`git remote add origin git@github.com:anhongpeng/test.git`

`git push -u origin master`

刷新 Github 仓库页面，看到已上传的文件，那么上传成功
