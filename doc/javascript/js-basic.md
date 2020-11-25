# JavaScript 重要基础知识点

## 面向对象

面向对象（Object-Oriented，OO）的语言有一个标志，那就是它们都有类的概念，而通过类可以创建任意多个具有相同属性和方法的对象。

### 数据属性和访问器属性

**数据属性**包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的特性：

* `[[Configurable]]`：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性；
* `[[Enumerable]]`：表示能否通过 `for-in` 循环返回属性；
* `[[Writable]]`：表示能否修改属性的值；
* `[[Value]]`：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 `undefined`；

可以使用 `Object.defineProperty()` 方法来修改属性特性。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。其中，描述符对象的属性必须是：`configurable`、`enumerable`、`writable` 和 `value`。设置其中的一或多个值，可以修改对应的特性值。例如：

``` js
var person = {}
Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Nicholas'
})

alert(person.name) // Nicholas
person.name = 'Greg'
alert(person.name) // Nicholas
```

**访问器属性**不包含数据值；它们包含一对儿 `getter` 和 `setter` 函数。在读取访问器属性时，会调用 `getter` 函数，这个函数负责返回有效的值；在写入访问器属性时，会调用 `setter` 函数并传入新值，这个函数负责决定如何处理数据。

访问器属性不能直接定义，必须使用 `Object.defineProperty()` 来定义：

``` js
var book = {
  _year: 2004,
  edition: 1
}

Object.defineProperty(book, 'year', {
  get: function() {
    return this._year
  },
  set: function(newValue) {
    if (newValue > 2004) {
      this._year = newValue
      this.edition += newValue - 2004
    }
  }
})

book.year = 2005
alert(book.edition) // 2
```

### 原型链与继承

#### 原型

我们创建的每个函数都有一个 `prototype` （原型）属性，这个属性是一个指针，指向一个对象，该对象包含着使用此函数作为构造函数所创建的实例对象们所共享的属性与方法。也就是说，`prototype` 就是通过调用构造函数而创建的那个实例对象的**原型对象**。

默认情况下，所有**原型对象**都会自动获得一个 `constructor` （构造函数）属性，这个属性是一个指向 `prototype` 属性所在函数的指针，因此有：

``` js
function Person() {}
Person.prototype.constructor === Person // true
```

当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象，这个指针叫 `[[prototype]]`，Firefox、Safari、Chrome 在每个对象上都支持一个属性 `_proto_` 以实现实例对象与构造函数的原型对象之间的关联：

``` js
function Person() {}

var person1 = new Person()
var person2 = new Person()

person1.__proto__ === Person.prototype // true
person2.__proto__ === Person.prototype // true
```

我们还可以通过 `isPrototypeOf` 方法来判断一个对象是否是某个实例对象所对应的原型：

`Person.prototype.isPrototypeOf(person1) // true`

也可以通过 `Object.getPrototypeOf()` 方法来得到实例对象对应的原型：

`Object.getPrototypeOf(person1) === Person.prototype // true`

#### 原型链

通过构造函数创建的实例对象有其对应的原型对象，而原型对象同样也可以是由构造函数创建，它也有它所对应的原型对象，由此往复，层层递进，就形成了实例与原型的链式结构。

当我们访问一个对象的属性或方法时，解析器会先从对象本身上搜索，如果没有搜索到，就会沿着原型链逐层往原型对象上查找。

#### 继承

##### 原型链继承

ECMAScript 中主要依赖原型链来实现继承。来看例子：

``` js
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.subProperty = false
}
SubType.prototype = new SuperType() // 这里通过重写子类的 prototype 来实现继承父类

SubType.prototype.getSubValue = function() {
  return this.subProperty
}

var instance = new SubType()
alert(instance.getSuperValue()) // true
```

示例中子类继承了父类，是通过创建 `SuperType` 的实例，并将该实例赋值给 `SubType.prototype` 来实现的。由此可见，**实现原型链继承的本质，是将父类实例赋值给子类的原型，它重写了子类的原型对象。**

值得一提的是，有**两种确定原型和实例关系的方式**：

一种是使用 `instanceof`，只要所测试的实例的原型链中出现过该构造函数，就会返回 `true`：

``` js
alert(instance instanceof Object) // true
alert(instance instanceof SuperType) // true
alert(instance instanceof SubType) // true
```

另一种是使用 `isPrototypeOf()`，只要所测试的原型在该实例的原型链中出现过，就会返回 `true`：

``` js
alert(Object.prototype.isPrototypeOf(instance)) // true
alert(SuperType.prototype.isPrototypeOf(instance)) //true
alert(SubType.prototype.isPrototypeOf(instance)) //true
```

##### 寄生组合式继承

通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

思路：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

优势总结：

1. 高效率体现在它只调用了一次 SuperType 构造函数，并且因此避免了在 SubType.prototype 上面创建不必要的、多余的属性；
2. 原型链还能保持不变
3. 由于原型链能保持不变，还能够正常使用 instanceof 和 isPrototypeOf()
4. 开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式！！！

``` js
function object(o) {
  function F() {} // 先创建了一个临时性的构造函数
  F.prototype = o // 然后将传入的对象作为这个构造函数的原型
  return new F() // 最后返回了这个临时类型的一个新实例
}

function inheritPrototype(subType, superType) { // 两个参数：子类型构造函数和超类型构造函数
  // Step1：创建超类型原型的一个副本。
  // prototype { __proto__: superType.prototype }
  var prototype = object(superType.prototype) // 创建对象

  // Step2：为创建的副本添加 constructor 属性，从而弥补因重写原型而失去的默认的 constructor 属性
  prototype.constructor = subType // 增强对象

  // Step3: 将新创建的对象（即副本）赋值给子类型的原型
  subType.prototype = prototype // 指定对象
}

function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function() {
  alert(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}

inheritPrototype(SubType, SuperType)

SubType.prototype.sayAge = function() {
  alert(this.age)
}
```
