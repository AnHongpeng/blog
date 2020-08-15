# MySql 入门

## 为何使用 mysql 而不是 mogondb

* mysql 是企业内最常用的存储工具，一般都有专人运维；
* mysql 也是社区内最常用的存储工具，有问题随时可查；

## MySql 介绍

* 目前 Web Server 中最流行的关系型数据库；
* 官网可免费下载，用于学习；
* 轻量级，易学易用；

## Mysql Workbench

* 操作 MySql 的客户端，可视化操作；
* 下载地址：https://dev.mysql.com/downloads/workbench/

## 操作数据库

### 表操作

* 增、删、改、查
* 使用 sql 语句

#### 增加

``` sql
use myblog;

show tables;

insert into users (username, `password`, realname) values ('zhangsan', '123', '张三');

insert into users (username, `password`, realname) values ('lisi', '123', '李四');
```

#### 查询

``` sql
select version(); -- 查询数据库版本

select * from users; -- 从 users 表中将所有列都查出来

select id, username from users;

select * from users where username='zhangsan';

select * from users where state <>'0'; -- 不等于

select * from users where username='zhangsan' and `password`='123';

select * from users where username='zhangsan' or `password`='123';

select * from users where username like '%zhang%'; -- 模糊查询

select * from users where `password` like '%1%';

select * from users where `password` like '%1%' order by id desc;

select * from blogs where author='lisi' order by createtime desc;

select * from blogs where title like '%A%' order by createtime desc;
```

#### 更新

``` sql
SET SQL_SAFE_UPDATES = 0;

update users set realname='李四2' where username='lisi';
```

#### 删除

``` sql
delete from users where username='lisi';

update users set state='0' where username='lisi'; -- 软删除，好处是数据可以恢复
update users set state='1' where username='lisi'; -- 数据恢复
```

## 其他

### 数据类型

* int：整型；
* varchar：字符型；
* longtext：最多能存 4 个 G；
* bigint：能存储更大数据的整型；
