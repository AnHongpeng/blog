# CSS BEM 规范介绍

## （一）概要

> BEM (Block, Element, Modifier) is a component-based approach to web development. The idea behind it is to divide the user interface into independent blocks. This makes interface development easy and fast even with a complex UI, and it allows reuse of existing code without copying and pasting.

BEM（块、元素、修饰符）基于Web开发中的组件化实现方式。背后思想是将用户界面拆分成独立的块。这使得即便在复杂UI场景下，界面开发也十分的简单和迅速，并且这套方案允许我们在不使用复制粘贴的情况下重用现有代码。

## （二）Block（块）

> A functionally independent page component that can be reused. In HTML, blocks are represented by the class attribute.

功能独立的页面元素（或简单或复杂）被视作一个块，它的 CSS 类名具有唯一性

### 块的特点

* 块的命名用来描述这个块的用途（“它是什么？” —— `menu` or `button`），而不是它的状态（“它是什么样？” —— `red` or `big`）
* 块不应影响它自身所处的环境，意味着不应为块设置外置的几何（margin）或者位置属性
* 不要使用 CSS 标签选择器 和 ID 选择器

[StackOverflow - How to set external geometry or positioning for BEM block?](https://stackoverflow.com/questions/48849586/how-to-set-external-geometry-or-positioning-for-bem-block)

这确保了块的独立性，以便于重用块或允许块在不同场景下被使用。

Example：

```html
<!-- 正确 -->
<div class="error"></div>

<!-- 错误，它描述了元素的表现 -->
<div class="red-text"></div>
```

### 块的使用指南

#### 块的嵌套规则

* 块之前可以相互嵌套
* 可以使用任意多的嵌套层级

Example：

```html
<header class="header">
  <div class="logo"</div>
  <form class="search-form"></form>
</header>
```

## （三）Element（元素）

块的组成部分，无法脱离块去使用。

### 元素的特点

* 元素的命名用来描述这个元素的用途（“它是什么？” —— `item`, `text`, 等等），而不是它的状态（“什么类型，或它是什么样？” —— `red`, `big`, 等等）
* 元素的整个命名结构是 `block-name__element-name`，元素名和块名通过双下划线 __ 分隔。

Example：

```html
<form class="search-form">
  <input class="search-form__input">
  <button class="search-form__button">Search</button>
</form>
```

### 元素的使用指南

#### 元素的嵌套规则

* 元素之间可以相互嵌套
* 可以使用任意多的嵌套层级
* 一个元素应始终是其块的组成部分，而不是其他元素的。这意味着元素命名不应被定义成类似层级如 `block__elm1__elm2`

Example：

```html
<!-- 正确，所有元素的命名结构都遵循模式 block-name__element-name -->
<form class="search-form">
  <div class="search-form__content">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
  </div>
</form>

<!-- 错误 -->
<form class="search-form">
  <div class="search-form__content">
    <!-- 建议: `search-form__input` 或 `search-form__content-input` -->
    <input class="search-form__content__input">
    <!-- 建议: `search-form__button` 或 `search-form__content-button` -->
    <button class="search-form__content__button">Search</button>
  </div>
</form>
```

块的命名实际上定义了命名空间，以确保其中的元素是基于这个块的。

块在其DOM树中允许存在嵌套结构的元素：

Example：

```html
<div class="block">
    <div class="block__elem1">
        <div class="block__elem2">
            <div class="block__elem3"></div>
        </div>
    </div>
</div>
```

然而，在BEM方法学中，这样的嵌套结构通常对应着扁平的 CSS 选择器定义：

Example：

```css
.block {}
.block__elem1 {}
.block__elem2 {}
.block__elem3 {}
```

这样的好处是，当我们改变块的内部 DOM 结构时，不需要改变每个独立元素的 CSS 代码：

Example：

```html
<div class="block">
    <div class="block__elem1">
        <div class="block__elem2"></div>
    </div>
    <div class="block__elem3"></div>
</div>
```

块的结构虽然变了，但元素的 CSS 规则和命名并未改变。

#### 元素的成员性（Membership）

元素永远都是块的一部分，而不应脱离块去单独使用它们。

Example：

``` html
<!-- 正确， 元素均处于 `search-form` 块内 -->
<form class="search-form">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
</form>

<!-- 错误， 元素位于了 `search-form` 块的外部 -->
<form class="search-form"></form>
<input class="search-form__input">
<button class="search-form__button">Search</button>
```

#### 元素的可选择性（Optionality）

元素相对于块组件是可选的。并非所有的块一定要具备元素。

Example：

```html
<div class="search-form">
    <input class="input">
    <button class="button">Search</button>
</div>
```

## （四）使用块还是元素

### 使用块

如果这部分代码可能会被重用，或者不受其他页面元素的影响，那么应该使用块。

### 使用元素

如果这部分代码无法脱离于它的父结构而单独存在，那么应该使用元素。

有个例外情况，为了简化开发，当需要将块的元素们分离成更小的部分（子元素）时，按照 BEM 的思想，不能为元素创建元素，在这种情况下，取而代之的是创建一个块而不是元素。

## （五）Modifier（修饰符）

用来定义块或元素的外观、状态或者行为。

### 修饰符的特点

* 修饰符的命名用来描述外观（“多大尺寸？” 或 “那套主题？” 等等 —— `size_s` 或者 `theme_islands`）；状态（“和其他块、元素有何不同？” —— `disabled`, `focused` 等）；还有行为（“它表现成如何？”或“它如何响应用户？” —— 例如 `directions_left-top`）
* 用单下划线 _ 来分割修饰符与块或元素的命名

### 修饰符类型

#### Boolean

* 当修饰符的存在与否起主要影响时使用 Boolean 类型。例如，`disabled`。当一个 Boolean 类型的修饰符存在时，假定它的值为 true。
* 命名遵循以下形式：
  * block-name_modifier-name
  * block-name__element-name_modifier-name

Example:

```html
<!-- 为 `search-form` 块定义了 `focused` 这一 Boolean 类型的修饰符 -->
<form class="search-form search-form_focused">
    <input class="search-form__input">
    <!-- 为 `button` 元素定义了 `disabled` 这一 Boolean 类型的修饰符 -->
    <button class="search-form__button search-form__button_disabled">Search</button>
</form>
```

#### Key-value

* 当修饰符的具体值起主要影响作用时使用 Key-value 类型。例如，一个使用 `islands` 设计主题的菜单：`menu_theme_islands`
* 命名遵循以下形式：
  * block-name_modifier-name_modifier-value
  * block-name__element-name_modifier-name_modifier-value

Example:

```html
<!-- 为 `search-form` 块定义值为 `islands` 的 `theme` 修饰符 -->
<form class="search-form search-form_theme_islands">
    <input class="search-form__input">
    <!-- 为 `button` 元素定义值为 `m` 的 `size` 修饰符 -->
    <button class="search-form__button search-form__button_size_m">Search</button>
</form>
<!-- 错误：不能同时地为两个相同 key 的修饰符定义不同的值 -->
<form class="search-form
             search-form_theme_islands
             search-form_theme_lite">
    <input class="search-form__input">
    <button class="search-form__button
                   search-form__button_size_s
                   search-form__button_size_m">
        Search
    </button>
</form>
```

### 修饰符的使用指南

#### 修饰符不能被单独使用

Example:

```html
<!-- 正确 -->
<form class="search-form search-form_theme_islands">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
</form>
<!-- 错误。缺少了 `search-form` -->
<form class="search-form_theme_islands">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
</form>
```

## （六）Mix（混合）

在一个 DOM 节点上使用不同 BEM Class 的技巧

使用混合，可以：

* 结合使用多个 BEM Class 的表现和样式，而不用复制代码
* 基于已有的 UI 组件创建新的语义化组件

Example:

```html
<!-- `header` 块 -->
<div class="header">
    <!-- `search-form` 块与 `header` 块的 `search-form` 元素进行混合 -->
    <div class="search-form header__search-form"></div>
</div>
```

> In this example, we combined the behavior and styles of the search-form block and the search-form element from the header block. This approach allows us to set the external geometry and positioning in the header__search-form element, while the search-form block itself remains universal. As a result, we can use the block in any other environment, because it doesn't specify any padding. This is why we can call it independent.

在本例中，结合了 `search-form` 块和 `header` 块中的 `search-form` 元素的表现和样式。我们可以在 `header__search-form` 元素上设置外部几何、位置
相关属性，而 `search-form` 块保持通用样式。这样我们可以在其他任何环境中使用 `search-form` 块，它没有指定任何补充样式，这也是为什么可以单独去使用它。

## （七）参考资源

* [BEM](https://en.bem.info/)
* [Tencent tmt-wrokflow CSS BEM 书写规范](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)
* [StackOverflow - How to set external geometry or positioning for BEM block?](https://stackoverflow.com/questions/48849586/how-to-set-external-geometry-or-positioning-for-bem-block)
