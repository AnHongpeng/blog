# CSS 重要基础知识点

## 变形与动画

### transform

`transform` 属性用于对元素进行 2D 或 3D 转换。常用的场景：

#### 2D 和 3D 旋转

* `transform: rotate(angle)`：通过指定的角度参数使元素相对原点进行旋转；
* `transform: rotate3d(x, y, z, angle)`：定义 3D 旋转；

eg：`transform: rotate(-20deg);`

#### 2D 和 3D 缩放

* `transform: scale(x, y)`：定义 2D 缩放转换；
* `transform: scale3d(x, y, z)`：定义 3D 缩放转换；
* `transform: scaleX(x)`、`scaleY(y)`、`scaleZ(z)`：通过设置 X/Y/Z 轴的值来定义缩放转换；

#### 位移 translate

* `transform: translate(x, y)`：定义 2D 位移；
* `transform: translate3d(x, y, z)`：定义 3D 位移；
* `transform: translateX(x)`、`translateY(y)`、`translateZ(z)`：定义研 X/Y/Z 轴进行位移；

#### 过渡 transition

在 CSS 中创建简单的过渡效果可以从以下几个步骤来实现：

1. 在默认样式中声明元素的**初始状态样式**；
2. 声明过渡元素**最终状态样式**；
3. 定义**过渡函数**；

CSS3 的过渡 `transition` 属性是一个复合属性，主要包括以下几个子属性：

* `transition-property`: 指定过渡或动态模拟的 CSS 属性；
* `transition-duration`: 指定完成过渡所需的时间；
* `transition-timing-function`: 指定过渡函数；
* `transition-delay`: 指定开始进行过渡的延迟时间；

### 关键帧动画 Keyframes

`Keyframes` 被称为关键帧，其类似于 Flash 中的关键帧。在 CSS3 中其主要以 `@keyframes` 开头，后面紧跟着是动画名称加上一对花括号 `{…}`，括号中就是一些不同时间段样式规则：

``` css
@keyframes wobble {
  0% {
    margin-left: 100px;
    background: green;
  }
  50% {
    margin-left: 150px;
    background: orange;
  }
  100% {
    margin-left: 100px;
    background: red;
  }
}
div {
  width: 100px;
  height: 100px;
  background: red;
  color: #fff;
}
div:hover {
  animation: wobble 5s ease .1s;
}
```
