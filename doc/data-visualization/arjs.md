# AR.js 技术调研

> 2019.12.09 发布，最后更新于 2019.12.09

Web 上高效的增强现实实现，手机端达 60fps。

AR.js 是 Web 上的轻量级增强现实库，拥有基于标记和基于地理信息位置的 AR 功能。

关键点：

* Very Fast: 可以高效地在手机上运行；
* Web-based: 这是一个纯 Web 解决方案，因此不需要安装，它全部由 JavaScript 基于 three.js + jsartoolkit5 实现；
* Open Source: 完全开源且免费；
* Standards: 可以在任何支持 [webgl(can i use)](https://caniuse.com/#feat=webgl) 和 [webrtc(can i use)](https://caniuse.com/#feat=stream) 的手机（IOS 上需要升级至 IOS11）上运行；

## （一）What "Marker Based" means

`AR.js` 使用 `artoolkit`，因此它是 `marker based` 的。`artoolkit` 是一个在增强现实领域实践了多年的软件，我们可以使用它做很多事情。

AR.js 支持对标记的广泛应用：多种类型标记的支持，以及同一时间多个独立标记的支持，更或者[多个标记如同一个标记那样行动](https://github.com/artoolkit/artoolkit-docs/blob/master/3_Marker_Training/marker_multi.md) 等，供你选择。

更多关于 marker 的细节，参考：

* [Artoolkit Open Doc](https://github.com/artoolkit/artoolkit-docs/tree/master/3_Marker_Training);
* [Detailed Article about markers](https://medium.com/swlh/ar-js-the-simplest-way-to-get-cross-browser-augmented-reality-on-the-web-10cbc721debc?);

## （二）What "Location Based" means

在此查阅 Location Based 文档：[here](https://github.com/jeromeetienne/AR.js/blob/location-based/aframe/README.md#location-based)

AR.js，在它的 `aframe` 实现中，一些自定义组件使得我们从 GPS 传感器中集成数据成为可能。 
 
> 全球定位系统（Global Positioning System，简称 GPS），又称全球卫星定位系统，是美国国防部研制和维护的中距离圆形轨道卫星导航系统。它可以为地球表面绝大部分地区（98%）提供准确的定位、测速和高精度的标准时间。全球定位系统可满足位于全球地面任何一处或近地空间的军事用户连续且精确地确定三维位置、三维运动和时间的需求。该系统包括太空中的 31 颗 GPS 人造卫星；地面上 1 个主控站、3 个数据注入站和 5 个监测站，及作为用户端的 GPS 接收机。最少只需其中 4 颗卫星，就能迅速确定用户端在地球上所处的位置及海拔高度；所能接收到的卫星讯号数越多，解码出来的位置就越精确。
>
> GPS 系统拥有如下多种优点：使用低频讯号，纵使天候不佳仍能保持相当的讯号穿透性；高达 98% 的全球覆盖率；高精度三维定速定时；快速、省时、高效率；应用广泛、多功能；可移动定位。不同于双星定位系统，使用过程中接收机不需要发出任何信号；此举增加了隐蔽性，提高了其军事应用效能。

我们可以添加 `gps-entity-place` —— 一个自定制的拥有指定经纬值的 `aframe` 实体。我们可以通过一个 script 添加他们，或者通过 APIS （Foursquare, Google Maps 或是其他等等）请求他们，再或者只是通过 HTML 静态地写入它们。

一旦我们添加了一个或多个 gps 实体，在 `camera` 上添加了 `gps-camera` 实体，经由系统计算，我们的位置以及距离地点的信息便会一帧帧地显示出来。

通过使用我们的手机传感器进行定向/定位，AR.js 可以在我们相机的一部分内容区域中显示每一个地方的物理位置。如果我们移动相机，那么会再次计算方向与位置，如果地点距离我们太远了，那么我们显示更小的增强内容，反之如果地点距离我们很近，那么我们展示更大的。

## （三）与微信衔接

微信内置浏览器及小程序 web-view 打开 [Example - Click Places](https://nicolo-carpignoli.herokuapp.com/examples/basic.html)，提示：

```text
nicolo-carpignoli.herokuapp.com

Webcam Error Name:

Message: WebRTC issue-! navigator.mediaDevices not present in your brower.
```

`mediaDevices` 是 `Navigator` 的只读属性，返回一个 `MediaDevices` 对象，该对象可提供对相机和麦克风等媒体输入设备的连接访问，也包括屏幕共享。

**目前微信 IOS 端内置浏览器不支持 WebRTC：**

参考 [ios 微信内置浏览器什么时候能支持webRTC？—— 微信开放社区](https://developers.weixin.qq.com/community/develop/doc/00022808f60b801827b7f00f656800) 以及 [Does iOS 11 WKWebView support WebRTC ? - Apple Developer Forums](https://forums.developer.apple.com/thread/88052)

> WebRTC，名称源自“网页即时通信”（Web Real-Time Communication）的缩写，是一个支持网页浏览器进行实时语音对话或视频对话的 API。它于 2011年6月1日开源并在 Google、Mozilla、Opera 支持下被纳入万维网联盟的 W3C 推荐标准。
>
> WebRTC (Web Real-Time Communications) 是一项实时通讯技术，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输。WebRTC包含的这些标准使用户在无需安装任何插件或者第三方的软件的情况下，创建点对点（Peer-to-Peer）的数据分享和电话会议成为可能。

几个相关资源：

* [WebRTC API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API);
* [Navigator.mediaDevices - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/mediaDevices);
* [MediaDevices.getUserMedia() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/getUserMedia);

## （四）其他线上资源

* [jsartoolkit5](https://github.com/artoolkit/jsartoolkit5);
