# Vue.js 组件系统

## （一）概述

组件系统是 Vue.js 的一个重要概念，它是一种对 DOM 结构的抽象。使用小型、独立和通常可复用的组件构建大型应用。

组件化也是 Vue.js 的核心思想之一，它允许我们用模板加对象描述的方式去创建一个组件。再加上我们给组件注入不同的数据，就可以完整地渲染出组件。

模板 + 对象描述 + 数据 => 组件

当数据更新后，组件可以自动重新渲染，因此用户只需要专注于数据逻辑的处理而无须关心 DOM 操作。无论是开发体验还是开发效率都得到了很大提升。

组件如何渲染到 DOM 上？数据变化后又是如何重新渲染的？

## （二）vnode 到真实 DOM 的转变

组件是对一颗 DOM 树的抽象。

组件渲染为 DOM 的几个步骤：创建 vnode -> 渲染 vnode -> 生成 DOM

vnode：是用来描述 DOM 的 JavaScript 对象，可以描述「不同类型的节点」，如普通元素节点、组件节点等、纯文本、注释等

渲染器：为跨平台渲染做准备的。可以简单理解为：包含平台核心渲染逻辑的 JavaScript 对象

E.g.在 HTML 中写一个 div：

``` html
<div class="box" style="width: 300px; height: 100px">我是个盒子</div>
```

那么用 vnode 描述这个 div：

``` js
const vnode = {
  type: 'div', // DOM 的标签类型
  props: { // DOM 的属性
    'class': 'box',
    style: {
      width: '300px',
      height: '100px'
    }
  },
  children: '我是个盒子' // DOM 的子节点，也可以是 vnode 数组
}
```

vnode 也可以用来描述组件：

E.g.在页面模板中引入自定义组件 `<my-modal>`：

``` html
<my-modal title="我的模态窗"></my-modal>
```

用 vnode 描述这个组件节点：

``` js
const MyModal = {
  // 定义组件对象
}
const vnode = {
  type: MyModal,
  props: {
    title: '我的模态窗'
  }
}
```
