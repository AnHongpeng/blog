# 离线应用与客户端存储

支持离线 Web 应用开发是 HTML5 的另一个重点。所谓离线 Web 应用，就是在设备不能上网的情况下仍然可以运行的应用。HTML5 把离线应用作为重点，主要是基于开发人员的心愿。前端开发人员一直希望Web应用能够与传统的客户端应用同场竞技，起码做到只要设备有电就能使用。

开发离线 Web 应用需要几个步骤。首先是确保应用知道设备是否能上网，以便下一步执行正确的操作。然后，应用还必须能访问一定的资源（图像、JavaScript、CSS 等），只有这样才能正常工作。最后，必须有一块本地空间用于保存数据，无论能否上网都不妨碍读写。HTML5 及其相关的 API 让开发离线应用成为现实。

## 离线检测

通过 `navigator.onLine` 属性是否为 `true` 来判断设备是否联网。另外，`window` 上提供了 `online` 和 `offline` 两个事件，当网络从离线变为在线会触发 `online`，从在线变为离线会触发 `offline`。

## 应用缓存

HTML5 的应用缓存（application cache），或者简称为 Appcache，是专门为开发离线 Web 应用而设计的。Appcache 就是从浏览器的缓存中分出来的一块缓存区。要想在这个缓存中保存数据，可以使用一个描述文件（manifest file），列出要下载和缓存的资源。下面是一个简单的描述文件示例：

``` manifest
CACHE MANIFEST
#Comment

file.js
file.css
```

在最简单的情况下，描述文件中列出的都是需要下载的资源，以备离线时使用。要将描述文件与页面关联起来，可以在 `<html>` 中的 `manifest` 属性中指定这个文件的路径：

`<html manifest="/offline.manifest">`

以上代码告诉页面，`/offline.manifest` 中包含着描述文件。这个文件的 MIME 类型必须是 `text/cache-manifest`。

虽然应用缓存的意图是确保离线时资源可用，但也有相应的 JavaScript API 让你知道它都在做什么。这个 API 的核心是`applicationCache` 对象，这个对象有一个 `status` 属性，属性的值是常量，表示应用缓存的如下当前状态：

* 0：无缓存，即没有与页面相关的应用缓存；
* 1：闲置，即应用缓存未得到更新；
* 2：检查中，即正在下载描述文件并检查更新；
* 3：下载中，即应用缓存正在下载描述文件中指定的资源；
* 4：更新完成，即应用缓存已经更新了资源，而且所有资源都已下载完毕，可以通过 `swapCache()` 来使用了；
* 5：废弃，即应用缓存的描述文件已经不存在了，因此页面无法再访问应用缓存；

应用缓存还有很多相关的事件，表示其状态的改变。以下是这些事件：

* `checking`：在浏览器为应用缓存查找更新时触发；
* `error`：在检查更新或下载资源期间发生错误时触发；
* `noupdate`：在检查描述文件发现文件无变化时触发；
* `downloading`：在开始下载应用缓存资源时触发；
* `progress`：在文件下载应用缓存的过程中持续不断地触发；
* `updateready`：在页面新的应用缓存下载完毕且可以通过 `swapCache()` 使用时触发；
* `cached`：在应用缓存完整可用时触发；

一般来讲，这些事件会随着页面加载按上述顺序依次触发。

## 数据存储

### Cookie

HTTP Cookie，通常直接叫做 cookie，最初是在客户端用于存储会话信息的。该标准要求服务器对任意 HTTP 请求发送 Set-Cookie HTTP 头作为响应的一部分，其中包含会话信息。

比如，一个服务器返回的响应头：

``` other
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```

收到服务器响应后，浏览器会储存 `Set-Cookie` 中的会话信息，之后的每个请求中都会添加 Cookie HTTP 头将信息发送回服务器：

``` other
GET /index.html HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```

发送回服务器的额外信息可以用于唯一验证客户来自于发送的哪个请求。

#### Cookie 的限制

Cookie 是绑定在特定域名下的。当设定了一个 cookie 后，再给创建它的域名发送请求时，都会包含这个 Cookie。这个限制确保了储存在 Cookie 中的信息只能让批准的接受者访问，而无法被其他域访问。

另外，对于不同浏览器，能够保存的 Cookie 的大小和条数也是有限制的。大多数浏览器都有大约 4096B（加减1）的长度限制，为了最佳的浏览器兼容性，最好将整个 cookie 长度限制在 4095B（含 4095）以内。

#### Cookie 的构成

Cookie 由浏览器保存的以下几块信息构成：

* 名称：一个唯一确定 Cookie 的名称，不区分大小写，须经过 URL 编码；
* 值：储存在 Cookie 中的字符串值。值须被 URL 编码；
* 域：Cookie 对于哪个域是有效的。所有向该域发送的请求中都会包含这个 Cookie 信息。如果没有明确设定，那么这个域会被认作是来自设置 Cookie 的那个域；
* 路径：指定域中的哪个路径，应该向服务器发送 Cookie。
* 失效时间：表示 Cookie 何时应该被删除的时间戳（也就是，何时应该停止向服务器发送这个 Cookie）。默认情况下，浏览器会话结束时即将所有 Cookie 删除，不过也可以自己设置删除时间。因此，Cookie 可在浏览器关闭后依然保存在用户的机器上；
* 安全标志：指定后，Cookie 只有在使用 SSL 连接的时候才发送到服务器；

以上每一段信息都作为 Set-Cookie 头的一部分，使用分号加空格分隔每一段：

``` other
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com
Other-header: other-header-value
```

尤其要注意，域、路径、失效时间和 secure 标志都是服务器给浏览器的指示，以指定何时应该发送 Cookie。这些参数并不会作为发送到服务器的 Cookie 信息的一部分，只有名值对儿才会被发送。

#### 操作 Cookie

通过 BOM 的 `document.cookie` 属性来读取和设置 Cookie。

当用来获取属性值时，`document.cookie` 返回当前页面可用的（根据 cookie 的域、路径、失效时间和安全设置）所有 `cookie` 字符串，一系列由分号隔开的名值对儿。例如：

`name1=value1;name2=value2;name3=value3`

其中所有名字和值都是经过 URL 编码的，所以必须使用 `decodeURIComponent()` 来解码。

当用于设置值的时候，`document.cookie` 属性可以设置为一个新的 Cookie 字符串。这个 Cookie 字符串会被解释并添加到现有的 Cookie 集合中。设置 `document.cookie` 并不会覆盖 Cookie，除非设置的 Cookie 的名称已经存在。设置 Cookie 的格式和 Set-Cookie 头中使用的格式一样。
