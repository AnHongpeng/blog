# nodejs 入门

## （一）NodeJS 的用途

* NodeJS，是一个 JavaScript 的运行环境；
* 运行在服务器，作为 Web Server；
* 运行在本地，作为打包、构建工具；

## （二）管理工具 NVM

nvm，NodeJS 版本管理工具，可切换多个 NodeJS 版本。

常用命令：

* `nvm list`：查看当前所有的 node 版本；
* `nvm install v10.13.0`：安装指定版本；
* `nvm use --delete-prefix 10.13.0`：切换到指定的版本；

## （三）nodejs 和 js 的区别

ECMAScript（ES）：

* 定义了**语法**，写 JavaScript 和 NodeJS 都必须遵守；
* 包含：变量定义、循环、判断、函数；
* 包含：原型与原型链、作用域和闭包、异步；
* 不能操作 DOM，不能监听事件，不能发送 AJAX 请求；
* 不能处理 HTTP 请求，不能操作文件；
* 即，只有 ECMAScript，几乎做不了任何实际的项目；

JavaScript（JS）：

* 使用 ECMAScript 语法规范，外加 Web API，缺一不可；
* 包含：DOM 操作、BOM 操作、事件绑定、AJAX 等；
* 两者结合，才可以完成浏览器端的任何操作；

NodeJS：

* 使用 ECMAScript 语法规范，外加 NodeJS API，缺一不可；
* 处理 HTTP 请求、处理文件等，具体参考 [Node.js API 文档](http://nodejs.cn/api/)；
* 两者结合，才可以完成 Server 端的任何操作；

总结：

* ECMAScript 是语法规范；
* NodeJS = ECMAScript + NodeJS API；

补充：

* commonjs 模块化；
* nodejs debugger；

## （四）commonjs

commonjs 是 NodeJS 中默认具备的模块化规范。

PS：通过 `npm init -y` 可以初始化 NPM 环境。

E.g：a.js 负责模块导出：

``` nodejs
function add(a, b) {
  return a + b
}

function mul(a, b) {
  return a * b
}

// 模块导出
module.exports = {
  add,
  mul
}
```

b.js 负责模块导入并使用：

``` nodejs
const { add, mul } = require('./a') // 导入模块 a
const _ = require('lodash') // 导入 nodejs 包

const sum = add(10, 20)
const result = mul(100, 200)

console.log(sum)
console.log(result)

const arr = _.concat([1, 2], 3)
console.log('arr...', arr)
```

## （五）NodeJS 的 debugger 方式

可以使用 VSCode 自带的调试工具进行调试，可以打断点、看控制台输出等。

另外，也可以基于 inspect 协议对 NodeJS 进行调试（推荐）：

1. `package.json` 的 `scripts` 的指令中，加入 `--inspect=9229`，要保证唯一；
2. 在 Chrome 中地址栏输入 `chrome://inspect`，并回车进入；
3. Console 中是控制台日志，Source 中是加载执行的代码；

## （六）Server 端和前端开发的区别

* 服务稳定性：服务不能随便就挂了；
* 考虑内存和 CPU（优化、扩展）；
* 日志记录；
* 安全；
* 集群和服务拆分；

### 服务稳定性

* Server 端可能会遭受各种恶意攻击和误操作；
* 单个客户端可以意外挂掉，但是服务端不能（一些公司通过一年的不可用时长来定 KPI）；
* 应用：使用 PM2 做进程守候。进程一旦挂掉，会自动重启，不用人工干预；

### 考虑内存和 CPU（优化、扩展）

* 客户端独占一个浏览器，内存和 CPU 都不是问题；
* Server 端要承载很多请求，CPU 和 内存都是稀缺资源；
* 使用 stream 写日志，使用 redis 存 session；

### 日志记录

* 前端也会参与写日志，但只是日志的发起方，不关心后续；
* Server 端要记录日志、存储日志、分析日志，前端不关心；

### 安全

* Server 端要随时准备接收各种恶意攻击，前端则少很多；
* 如：越权操作、数据库攻击等；
* 措施：登录验证、预防 XSS 攻击和 sql 注入等；

### 集群和服务拆分

* 产品发展速度快，流量可能迅速增加；
* 如果通过扩展机器和服务拆分来承载大流量？

## （七）HTTP 请求概述

从在浏览器中输入 URL 到显示页面的整个过程？

1. DNS 解析（从域名解析为 IP 地址，IP 地址对应到一台 服务器），客户端与服务器之间建立 TCP 连接（3 次握手），发送 HTTP 请求；
2. Server 端接收到 HTTP 请求，处理并返回；
3. 客户端接收到返回数据，处理数据（如渲染页面、执行 JS）；

三次握手：

1. 客户端询问服务器是否可用？
2. 服务器告诉客户端自己可用；
3. 客户端再次告诉服务器：我知道了，我即将访问；

三次握手后，开始发送 HTTP 请求。

### nodejs 处理 get 请求

* get 请求，即客户端要向 Server 端获取数据，如查询博客列表；
* 通过 querystring 来传递数据，如 `a.html?a=100&b=200`；
* 浏览器直接访问，就发送 get 请求；

### nodejs 处理 post 请求

* post 请求，即客户端要向 Server 端传递数据，如新建博客；
* 通过 post data 传递数据；
* 浏览器无法直接模拟，需要手写 JS，或者使用 postman；

## （八）搭建开发环境

### nodemon

nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

* [nodemon](https://github.com/remy/nodemon)

### cross-env

* [cross-env](https://github.com/kentcdodds/cross-env)

## （九）开发接口

* 初始化路由：根据之前技术方案的设计，做出路由
* 返回假数据：将路由和数据处理分离，以符合设计原则

### 路由与 API 区别

API：前端和后端、不同端（子系统）之间对接的一个术语。一般包含：

* url（路由）：E.g.'/api/blog/list'
* 输入
* 输出

路由：
* 可以理解成 API 的一部分；
* 后端系统内部的一个定义；
