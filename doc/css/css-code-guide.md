# CSS 编码规范实践点记录（持续更新）

> 2018.02.25 发布，最后更新于 2019.10.28，By 鸿鹏

## （一）注释

注释统一用 `/* */`，缩进与下一行代码保持一致；可位于一个代码行的末尾，与代码间隔一个空格。

```css
/* Modal header */
.modal-header {
    ...
}

/*
 * Modal header
 */
.modal-header {
    ...
}
.modal-header {
    width: 50px;
    color: red; /* color red */
}
```

## （二）选择器命名

使用 BEM 命名，参考 [BEM 命名规范](https://github.com/AnHongpeng/blog/issues/6)

## （三）选择器嵌套层级

DOM 渲染过程中，为了减少 CSS 声明规则与 DOM 节点匹配的回溯成本，CSS 引擎的解析顺序被设计为从右向左。过多的选择器嵌套会大大影响匹配效率（eg, `.demo .demo__ul span { ... }`），因此应最大程度上避免嵌套 CSS 选择器的使用。

绝大多数场景下不需要进行选择器嵌套。如果使用嵌套，嵌套层级不超过3层。

## （四）属性声明顺序

属性声明按顺序做分组处理：

1. 布局（Layout）
2. 定位（Positioning
3. 尺寸（Dimension）：内外边距、边框、宽高
4. 文字排版控制
5. 文字颜色及背景
6. 动画、过渡
7. 其他

```css
.declaration-order {
  display: block;
  float: right;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  border: 1px solid #e5e5e5;
  border-radius: 3px;
  width: 100px;
  height: 100px;

  font: normal 13px "Helvetica Neue", sans-serif;
  line-height: 1.5;
  text-align: center;

  color: #333;
  background-color: #f5f5f5;

  opacity: 1;
}
```

下面是推荐的属性的顺序：

```other
[
    [
        "display",
        "visibility",
        "float",
        "clear",
        "overflow",
        "overflow-x",
        "overflow-y",
        "clip",
        "zoom"
    ],
    [
        "table-layout",
        "empty-cells",
        "caption-side",
        "border-spacing",
        "border-collapse",
        "list-style",
        "list-style-position",
        "list-style-type",
        "list-style-image"
    ],
    [
        "position",
        "top",
        "right",
        "bottom",
        "left",
        "z-index"
    ],
    [
        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "box-sizing",
        "border",
        "border-width",
        "border-style",
        "border-color",
        "border-top",
        "border-top-width",
        "border-top-style",
        "border-top-color",
        "border-right",
        "border-right-width",
        "border-right-style",
        "border-right-color",
        "border-bottom",
        "border-bottom-width",
        "border-bottom-style",
        "border-bottom-color",
        "border-left",
        "border-left-width",
        "border-left-style",
        "border-left-color",
        "border-radius",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius",
        "border-image",
        "border-image-source",
        "border-image-slice",
        "border-image-width",
        "border-image-outset",
        "border-image-repeat",
        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "width",
        "min-width",
        "max-width",
        "height",
        "min-height",
        "max-height"
    ],
    [
        "font",
        "font-family",
        "font-size",
        "font-weight",
        "font-style",
        "font-variant",
        "font-size-adjust",
        "font-stretch",
        "font-effect",
        "font-emphasize",
        "font-emphasize-position",
        "font-emphasize-style",
        "font-smooth",
        "line-height",
        "text-align",
        "text-align-last",
        "vertical-align",
        "white-space",
        "text-decoration",
        "text-emphasis",
        "text-emphasis-color",
        "text-emphasis-style",
        "text-emphasis-position",
        "text-indent",
        "text-justify",
        "letter-spacing",
        "word-spacing",
        "text-outline",
        "text-transform",
        "text-wrap",
        "text-overflow",
        "text-overflow-ellipsis",
        "text-overflow-mode",
        "word-wrap",
        "word-break"
    ],
    [
        "color",
        "background",
        "background-color",
        "background-image",
        "background-repeat",
        "background-attachment",
        "background-position",
        "background-position-x",
        "background-position-y",
        "background-clip",
        "background-origin",
        "background-size"
    ],
    [
        "outline",
        "outline-width",
        "outline-style",
        "outline-color",
        "outline-offset",
        "opacity",
        "box-shadow",
        "text-shadow"
    ],
    [
        "transition",
        "transition-delay",
        "transition-timing-function",
        "transition-duration",
        "transition-property",
        "transform",
        "transform-origin",
        "animation",
        "animation-name",
        "animation-duration",
        "animation-play-state",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction"
    ],
    [
        "content",
        "quotes",
        "counter-reset",
        "counter-increment",
        "resize",
        "cursor",
        "user-select",
        "nav-index",
        "nav-up",
        "nav-right",
        "nav-down",
        "nav-left",
        "tab-size",
        "hyphens",
        "pointer-events"
    ]
]
```

## （五）颜色

颜色16进制用小写字母；颜色16进制尽量用简写。

```css
/* not good */
.element {
    color: #ABCDEF;
    background-color: #001122;
}

/* good */
.element {
    color: #abcdef;
    background-color: #012;
}
```

## （六）属性简写

`margin` 和 `padding` 需要使用属性简写（当上下左右值均需要明确定义时，否则拆开单独定义）

对于其他属性，在大多数情况下并不需要设置属性简写中包含的所有值，所以建议尽量分开声明会更加清晰

常见的可简写属性包括：

* `font`
* `background`
* `transition`
* `animation`

```css
/* not good */
.element {
    transition: opacity 1s linear 2s;
}

/* good */
.element {
    transition-delay: 2s;
    transition-timing-function: linear;
    transition-duration: 1s;
    transition-property: opacity;
}
```

## （七）注意项

* 去掉小数点前面的0
* 属性值'0'后面不要加单位
* 用 `border: 0;` 代替 `border: none;`
* 使用 AntD 的项目，由于 AntD 依赖 Normalize 7，元素默认使用 `box-sizing: border-box;` 布局（即怪异盒模型）

## （八）在 React 技术栈中的应用

使用 [CSS Modules](https://github.com/camsong/blog/issues/5) 技术。

结合 [create-react-app](https://github.com/facebook/create-react-app)，当前版本是 1.5.2，需要使用 [react-app-rewired](https://github.com/timarney/react-app-rewired) 并配合 [react-app-rewire-css-modules](https://github.com/codebandits/react-app-rewire-css-modules) 来使用 CSS 模块化技术。

在未来的 create-react-app 2.x 版本中将会更好地支持 CSS 模块化，[Add support for CSS Modules with explicit filename - [name].module.css](https://github.com/facebook/create-react-app/pull/2285)，现处于持续关注中

## （九）参考资源

* [网易 NEC 规范](http://nec.netease.com/standard/css-sort.html)
* [腾讯 AlloyTeam CSS 规范](http://alloyteam.github.io/CodeGuide/#css)
* [百度 fex-team CSS 规范](https://github.com/fex-team/styleguide/blob/master/css.md)
* [CSS Modules 详解及 React 中实践](https://github.com/camsong/blog/issues/5)
* [Add support for CSS Modules with explicit filename - [name].module.css](https://github.com/facebook/create-react-app/pull/2285)
