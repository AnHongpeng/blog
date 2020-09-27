# JavaScript 设计模式剖析

## （一）单例模式

单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏览器中的 `window` 对象等。又比如实际业务中，一个登录浮窗就是全局唯一的，无论我们点多少次登录按钮，该浮窗只会被创建一次。

编码示例，一个惰性单例，当点击登录按钮后，登录弹窗才会被创建，且重复点击也仅会创建一次：

``` js
// 职责：管理单例。fn 是创建单例对象的方法，它作为参数传入 getSingle 函数中
var getSingle = function(fn) {
  var result
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}

// 职责：创建登录浮窗实例并返回
var createLoginLayer = function() {
  var div = document.createElement('div')
  div.innerHTML = '我是登录浮窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}

// 这里也使用了代理模式，createLoginLayer 可以换成其他对象创建函数
var createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onclick = function() {
  var loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
```

例子中，我们把创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法可以独立变化而互不影响，当它们连接在一起的时候，就完成了创建唯一实例对象的功能。

小结：惰性单例模式在实际业务开发中是非常常用的，它的精髓是，仅在合适的时机才创建实例对象，并且只创建唯一的一个，另外可以使用代理模式进行单例的管理，以实现编码复用。

## （二）策略模式

在程序设计中，我们为了实现一个功能往往同时有很多方案可以选择。比如一个压缩文件的程序，既可以选择 zip 算法，也可以选择 gzip 算法。

策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

策略模式的目的是将这些算法的使用与实现分离开来。一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 第二个部分是环境类 Context，Context 接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明 Context 中要维持对某个策略对象的引用。

## （三）代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。

假定小明想表白一直暗恋的女神 A，给她送花，但是他很害羞，他委托他与 A 共同的朋友 B 代他送花。B 很聪明，当女神 A 心情很好的时候才会代送，这样表白成功率更高。来看代码：

``` js
var Flower = function() {}

var xiaoming = {
  sendFlower: function(target) {
    var flower = new Flower()
    target.receiveFlower(flower)
  }
}

var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() { // B 收到花后会监听 A 的好心情
      A.receiveFlower(flower)
    })
  }
}

var A = {
  receiveFlower: function(flower) {
    console.log('收到花' + flower)
  },
  listenGoodMood: function(fn) {
    window.setTimeout(function() { // 假设 10 秒后 A 的心情变化
      fn()
    }, 10000)
  }
}

xiaoming.sendFlower(B)
```

### 保护代理和虚拟代理

以上例子中，代理 B 可以帮助 A 过滤掉一些请求，比如送花的人中年龄太大的或者没有宝马的，这种请求就可以直接在代理 B 处被拒绝掉。这种代理叫作**保护代理**。**保护代理用于控制不同权限的对象对目标对象的访问**。

假设现实中的花价格不菲，导致在程序世界里，`new Flower()` 也是一个代价昂贵的操作，那么我们可以把 `new Flower` 的操作交给代理 B 去执行，代理 B 会选择在 A 心情好时再执行 `new Flower()`，这是代理模式的另一种形式，叫作**虚拟代理**。**虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建**。代码如下：

``` js
var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() { // B 收到花后会监听 A 的好心情
      var flower = new Flower() // 延迟创建 flower 对象
      A.receiveFlower(flower)
    })
  }
}
```

### 其他代理模式

代理模式的变体种类非常多，比如如下应用场景：

* 防火墙代理：控制网络资源的访问，保护主题不让“坏人”接近；
* 远程代理：为一个对象在不同的地址空间提供局部代表，在 Java 中，远程代理可以是另一个虚拟机中的对象；
* 保护代理：用于对象应该有不同访问权限的情况；
* 智能引用代理：取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数；
* 写时复制代理：通常用于复制一个庞大对象的情况。写时复制代理延迟了复制的过程，当对象被真正修改时，才对它进行复制操作。写时复制代理是虚拟代理的一种变体，DLL（操作系统中的动态链接库）是其典型运用场景；

## （五）发布-订阅模式

发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

订阅发布模式的优点：

* **可以广泛应用于异步编程中**，这是一种替代传递回调函数的方案。我们无需过多关注对象在异步运行期间的内部状态，而只需要订阅感兴趣的事件发生点；
* 发布—订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。**发布—订阅模式让两个对象松耦合地联系在一起**，虽然不太清楚彼此的细节，但这不影响它们之间相互通信。当有新的订阅者出现时，发布者的代码不需要任何修改；同样发布者需要改变时，也不会影响到之前的订阅者。只要之前约定的事件名没有变化，就可以自由地改变它们。

一个通用的发布-订阅模式实现：

``` js
var event = {
  clientList: {}, // 存放订阅消息，用 key 来区分消息的分类
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn) // 订阅的消息添加进缓存列表
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key]

    if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
      return false;
    }
    for (var i = 0, fn; fn = fns[i++]) {
      fn.apply(this, arguments) // arguments 是 trigger 时带上的参数
    }
  },
  remove: function(key, fn) {
    var fns = this.clientList[key]

    if (!fns) { // 如果 key 对应的消息没有被人订阅，则直接返回
      return false
    }
    if (!fn) { // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
      fns && (fns.length = 0)
    } else {
      for (var l = fns.length - 1; l >= 0; l--){ // 反向遍历订阅的回调函数列表
        var _fn = fns[l]
        if (_fn === fn ) {
          fns.splice(l, 1) // 删除订阅者的回调函数
        }
      }
    }
  }
}
```

小结：

优势：一为时间上的解耦，二为对象之间的解耦。它的应用非常广泛，既可以用在异步编程中，也可以帮助我们完成更松耦合的代码编写。发布—订阅模式还可以用来帮助实现一些别的设计模式，比如中介者模式。从架构上来看，无论是 MVC 还是 MVVM，都少不了发布—订阅模式的参与，而且 JavaScript 本身也是一门基于事件驱动的语言。

劣势：创建订阅者本身要消耗一定的时间和内存，而且当你订阅一个消息后，也许此消息最后都未发生，但这个订阅者会始终存在于内存中。另外，发布—订阅模式虽然可以弱化对象之间的联系，但如果过度使用的话，对象和对象之间的必要联系也将被深埋在背后，会导致程序难以跟踪维护和理解。特别是有多个发布者和订阅者嵌套到一起的时候，要跟踪一个 bug 不是件轻松的事情。
