# Krpano 技术调研

> 2019.12.07 发布，最后更新于 2019.12.07

## krpano XML 参考

Krpano 使用简单的 XML 语法来存储对 krpano 视图的设置。这些文件可以被任何使用到的编辑器修改编辑，但要注意的是一定要遵循 XML 语法（这些语法并不是 krpano 特有的，而是对于所有 XML 文件通用的）。

从本质上讲，该 xml 本身只是形式上的转译——这意味着它仅仅被用于将数据衔接仅 krpano 视图。一旦该 xml 被解析，那么 xml 的元素将会被转译进 krpano 内部的数据结构中，这意味着一旦 xml 被解析后在 krpano 内部便不复存在了。

* [Basic XML Syntax Rules](https://krpano.com/docu/xml/syntaxrules/#top);
* [krpano XML Reference](https://krpano.com/docu/xml/#top);
* [Special krpano XML elements and attributes](https://krpano.com/docu/xml/#xmlspecial);

### `<include url="..." />` 引其他 xml 配置

使用 `<include>` 元素来引进其他 XML 文件。

### `<preview>` 快速加载预览全景图

定义一个小体积的用于预览的全景图，在加载全部的全景图过程中它将被提前显示。该用于预览的全景图一定要足够小以确保快速加载。

### `<image>` 定义全景图

使用 `<image>` 元素来定义全景图。支持以下全景格式化类型：

* Cube：6 张独立的图片来形成一个立方体；
* Cubestrip：1 张包含了立方体 6 个面的条形图片；
* Sphere：一张球面全景图；
* Cylinder：一张圆柱形全景图；
* Flat：一张平坦的/线性图；
* Fisheye：由鱼眼相机镜头拍摄的图片或视频；
* Depthmap：为全景图增加 3D 深度。使用一维图像构造立体渲染，以满足 VR 浏览、3D 过渡，或是在 3D 空间中行走；

### `view` 设置当前视图

`<view>` 元素包含了当前视图信息，可以在 xml 中设定初始化的视图配置。可设置水平、垂直观看方向，景深，以及对视角的限制。

### `<autorotate>` 自动移动镜头

当没有用户交互的时候，自动地进行镜头旋转、移动、伸缩景深。

### `<layer>`/`<plugin>` 图层或插件

使用 `<layer>` 或 `<plugin>` 元素来引入图片、图标、按钮或其他动态的插件（比如 krpano plugins）。

注意：`<layer>` 或 `<plugin>` 准确地来说在 krpano 内部其实是同一个元素，它们仅仅是名字不同罢了。更建议使用 "layer" 来代替 "plugin" 来描述元素，"plugin" 这种叫法是在旧版本 krpano 中使用的，因此保留它仅仅是为了向前兼容。

### `<hotspot>` 热点

热点是全景世界中的一块区域，它们可以响应鼠标移入移出或点击等的用户操作事件。它们被用于加载其他全景场景、链接至其他 url、改变视图等等......

有 2 种类型的热点：

* 多边形热点：由一系列点定义的多边形区域；
* 多媒体热点：由图片、动画或视频构成的热点；

热点支持的事件：

* onover;
* onhover;
* onout;
* ondown;
* onup;
* onclick;
* onloaded;

### `<style name="stylename" attributes... />` 复用元素属性

`<style>` 元素与 `style` 属性：

`<style>` 元素是对元素所包含的任意属性的一个集合（或存储）。

任何其他拥有 `name` 属性的元素可以设置 `style` 属性。当 xml 元素首次创建时，所有在 `<style>` 元素上定义的属性将被拷贝到该元素上。

Every other xml element that has a name attribute can also have a style attribute. When the xml element will be first created, all attributes defined at the `<style>` element will be copied to the element itself. This will be done before the attributes that are defined at xml element itself will be applied.

That means it's possible to predefine some settings in the `<style>` element and then overwrite them later with the attributes defined directly at the element.

### `<action>` 行为

With `<action>` elements it's possible to define krpano actions. These actions are similar to functions or procedures in other scripting or programming languages.

The actions can be called from everywhere - from events, from other actions or also from external sources (Javascript, Plugins) via the call interface.

* Normal krpano actions: Inside a normal `<action>` element a sequence of krpano action calls can be placed. These action calls will be executed one after the other when the action gets called.
* Javascript krpano actions (HTML5 only): With Javascript actions it's possible to use directly Javascript code for the action code. This can be faster for more complex things. Javascript actions are only available in the krpano HTML5 viewer.

### 其他一些小点

* `control` 控制鼠标与键盘行为；
* `cursor` 自定义鼠标指针；

### 待调研

* `<area>`
* `<display>`

## krpano Actions / Scripting Reference

krpano has a small and simple dynamic scripting language. With it krpano can be customized in many ways. A command or function is called 'action' in krpano. It's possible to use existing actions and also to define new ones. The scripting language is dynamic and untyped by default, only some predefined variables are typed, but that is normally not relevant because inside the scripts all type conversions will be done automatically.

* [Syntax and Usage](https://krpano.com/docu/actions/#syntaxandusage)

## Plugins

### Textfield Plugin（internal / build-in plugin）

* A plugin for displaying HTML/CSS formatted text
* The position and size of the plugin can by adjusted with the standard layer attributes.
* When no custom width/height size will be set, the plugin will resize itself to fit the text.

## 与微信小程序衔接

小程序本质上是运行在 webview 上的一个 H5 应用，代码经过打包后分别运行在渲染线程与逻辑线程，这么做最大的原因是保证平台安全性。

同构方案：

* 编译时转换：Taro
* 运行时适配：kbone, remax

kbone 与 remax 方案对比：

* 相同点：
  * 都是在 worker 线程维护一棵 vdom tree，然后同步到 render 线程通过 w|axml 来进行渲染；
* 不同点：
  * kbone 是适配了 js dom api ，上层可以用任何框架，如 react、vue、原生 js 来写小程序。remax 是自已写了一套 react 的 renderer，上层只支持 react；
  * remax 在 dom tree 发生变化时，不是把整棵 vdom tree 传到 render 线程，而是计算差异，把差异传到 render 线程，这点可以加快了两个线程之间的数据传输速度；

kbone 在 worker 线程适配了一套 js dom api，上层不管是哪种前端框架(react、vue)或原生 js 最终都需要调用 js dom api 操作 dom，适配的 js dom api 则接管了所有的 dom 操作，并在内存中维护了一棵 dom tree，所有上层最终调用的 dom 操作都会更新到这棵 dom tree 中，每次操作(有节流)后会把 dom tree 同步到 render 线程中，通过 wxml 自定义组件进行 render。

kbone 定义了一个 [Element 自定义组件]，用于渲染 dom tree 上的每个节点和他的孩子节点。
Element 节点做的事情比较简单，首先是把自己渲染出来，然后再把子节点渲染出来，同时子节点的子节点又通过 Element 来渲染，这样就通过自定义组件实现了递归功能，这是 wxml 自定义组件提供的自引用特性，每个节点通过 dom 节点的 type 来区分，从而把一棵内存 dom tree 通过 wxml 渲染出来了。

remax 是通过 react 来写小程序，整个小程序是运行在 worker 线程，remax 实现了一套自定义的 renderer，原理是在 worker 线程维护了一套 vdom tree，这个 vdom tree 会通过小程序提供的 setData 方法传到 render 线程，render 线程则把 vdom tree 递归的遍历出来。

remax 是通过 react 来写小程序，整个小程序是运行在 worker 线程，remax 实现了一套自定义的 renderer，原理是在 worker 线程维护了一套 vdom tree，这个 vdom tree 会通过小程序提供的 setData 方法传到 render 线程，render 线程则把 vdom tree 递归的遍历出来。

* [threejs-miniprogram - Three.js 小程序 WebGL 的适配版本](https://developers.weixin.qq.com/miniprogram/dev/extended/utils/threejs.html)

## 相关资源

* [Krpano.com](https://krpano.com/news/)
* [Krpano.com Forum](https://krpano.com/forum/wbb/index.php?l=2)
