# 理解 Flow 中的泛型类型（Generic Types）

`React` 中使用 [Flow](https://flow.org/en/) 进行静态类型检测，在 `shared/ReactTypes.js` 中大量使用了 Flow 的语法特性，其中对泛型的理解是个难点，本文就 `Flow` 中的泛型类型的使用展开讲解，文末结合 React 源码对部分应用场景做了详细分析。

## （一）泛型概念

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

[Flow - Generic Types](https://flow.org/en/docs/types/generics/) 中开头的例子浅显易懂，这里做补充讲解：

思考这个 `identity` 函数，它会返回任何传入它的值：

```js
function identity(value) {
  return value
}
```

由于传入它的参数值可以是任意类型的，因此很难去具体指定类型：

```js
function identity(value: string): string {
  return value
}
```

即便我们使用 `any`：

```js
function identity(value: any): any {
  return value
}
```

也会丢失一部分约束——参数的类型应该与返回值的类型是一致的。因此，我们需要一种方式来将这种约束关系标注出来。这里使用`类型变量`，它只用于表示类型而不是值：

```js
function identity<T>(value: T): T {
  return value
}
```

类型变量 `T` 帮我们捕获函数传入的参数类型（比如 `number`），由于返回值类型也是 `T`，与传参类型一致，所以返回值也是 `number` 类型的。这种编译器根据传入的参数自动推断出类型的过程叫做“类型推论”，它使得我们的代码保持精简和高可读性。

## （二）泛型语法

### 泛型函数

创建泛型函数的语法是在“参数列表”前添加“类型参数列表” `<T>`

```js
function method<T>(param: T): T {
  // ...
}
function<T>(param: t): T {
  // ...
}
```

### 泛型函数类型

```js
function method(func: <T>(param: T) => T) {
  // ...
}
```

### 泛型类

创建泛型类的语法是在 `class` 主体前声明类型参数列表

```js
class Item<T> {
  //...
}
```

之后便可以在 `class` 中（属性的类型、方法的参数或是返回值类型）使用它们了：

```js
class Item<T> {
  prop: T
  constructor(param: T) {
    this.prop = param
  }
  method(): T {
    return this.prop
  }
}
```

### 泛型类型别称

```js
type Item<T> = {
  foo: T,
  bar: T,
}
```

### 泛型接口

```js
interface Item<T> {
  foo: T,
  bar: T,
}
```

### 为调用提供类型参数

可以在调用中直接为其泛型提供实体类型参数：

```js
// @flow
function doSomething<T>(param: T): T {
  // ...
  return param
}

doSomething<number>(3)
```

可以直接在 `new` 表达式中提供泛型类型参数：

```js
// @flow
class GenericClass<T> {}
const c = new GenericClass<number>()
```

如果仅仅想指定类型参数中的某几个参数，可以使用 `_` 来让 flow 推断类型：

```js
// flow
class GenericClass<T, U, V>{}
const c = new GenericClass<_, number, _>()
```

## （三）泛型的行为表现

### 泛型的使用如同变量

泛型就像变量或函数参数那样，除了不能将它们当做类型用之外，可以在作用域中任何适当的地方使用它们：

```js
function constant<T>(value: T): () => T {
  return function(): T {
    return value
  }
}
```

### 按需创建多个泛型

```js
function identity<One, Two, Three>(one: One, two: Two, three: Three) {
  //...
}
```

### 泛型值的跟踪

当对一个值使用泛型类型后，`Flow` 会跟踪它并且确保它不被其他类型值所代替：

```js
// @flow
function identity<T>(value: T): T {
  // $ExpectError
  return 'foo' // Error!
}
function identity<T>(value: T): T {
  // $ExpectError
  value = 'foo' // Error!
  // $ExpectError
  return value // Error!
}
```

### 为泛型添加类型

类似于 `mixed`，泛型是“未知”类型。如果已经指定了具体的类型，那么不能再使用泛型：

```js
// @flow
function logFoo<T>(obj: T): T {
  // $ExpectError
  console.log(obj.foo) // Error!
  return obj
}
```

虽然可以继续优化以上代码，但泛型始终允许传入任意类型的值：

```js
// @flow
function logFoo<T>(obj: T): T {
  if (obj && obj.foo) {
    console.log(obj.foo) // Works
  }
  return obj
}
logFoo({ foo: 'foo', bar: 'bar' });  // Works.
logFoo({ bar: 'bar' }); // Works. :(
```

取而代之的是，我们可以为泛型添加类型，就如同处理函数参数那样：

```js
// @flow
function logFoo<T: { foo: string }>(obj: T): T {
  console.log(obj.foo) // Works!
  return obj
}
logFoo({ foo: 'foo', bar: 'bar' });  // Works!
// $ExpectError
logFoo({ bar: 'bar' }); // Error!
```

因此这种方式下既使用了泛型，又确保了仅是指定的类型被使用：

```js
// @flow
// @flow
function identity<T: number>(value: T): T {
  return value;
}

let one: 1 = identity(1)
let two: 2 = identity(2)
// $ExpectError
let three: "three" = identity("three")
```

### 泛型的使用如同边界

```js
// @flow
function identity<T>(val: T): T {
  return val;
}
let foo: 'foo' = 'foo' // Works!
let bar: 'bar' = identity('bar') // Works!
```

使用 `Flow` 时，当把一个类型传入另一个类型时，原本的类型会丢失。因此，当我们传递一个指定类型到一个较笼统的类型后，`Flow` 会“忘记”前者这个更具体的类型：

```js
// @flow
function identity(val: string): string {
  return val
}
let foo: 'foo' = 'foo' // Works!
// $ExpectError
let bar: 'bar' = identity('bar') // Error!
```

使用泛型使得我们在添加约束时将更具体的类型保持住。这种情况下，`Flow` 的行为更像是边界：

```js
// @flow
function identity<T: string>(val: T): T {
  return val
}
let foo: 'foo' = 'foo' // Works!
let bar: 'bar' = identity('bar') // Works!
```

注意，一旦使用了这种边界似的泛型值时，不能再将它们用作更具体的类型：

```js
// @flow
function identity<T: string>(val: T): T {
  let str: string = val // Works!
  // $ExpectError
  let bar: 'bar' = val // Error!
  return val
}
identity('bar')
```

### 参数化的泛型

使用泛型有时就像函数传参一样可以传入类型，这种行为被称作参数化泛型（或参数多态）。例如，一个参数化的泛型类型别称，当使用它时需要提供一个类型参数：

```js
type Item<T> = {
  prop: T
}
let item: Item<string> = {
  prop: 'value'
}
```

可以将此视为传递参数到函数，返回值是我们可以使用的类型。类（当被用作 'type' 时）、类型别称和接口，使用它们的泛型都需要我们传递类型参数。函数和函数类型没有参数化泛型。

`classes`：

```js
// @flow
class Item<T> {
  prop: T
  constructor(param: T) {
    this.prop = param
  }
}
let item1: Item<number> = new Item(42) // Works!
// $ExpectError
let item2: Item = new Item(42) // Error!
```

`Type Aliases`：

```js
// @flow
type Item<T> = {
  prop: T
}
let item1: Item<number> = { prop: 42 } // Works!
// $ExpectError
let item2: Item = { prop: 42 } // Error!
```

`interfaces`：

```js
// @flow
interface HasProp<T> {
  prop: T,
}
class Item {
  prop: string
}
(Item.prototype: HasProp<string>) // Works!
// $ExpectError
(Item.prototype: HasProp) // Error!
```

### 为参数化泛型添加默认值

可以像为函数定义参数那样为参数化泛型定义默认值：

```js
type Item<T: number = 1> = {
  prop: T,
}
let foo: Item<> = { prop: 1 }
let bar: Item<2> = { prop: 2 }
```

### Variance Sigils

## （四）结合 React 源码的实例分析

`packages/react/src/forwardRef.js` 中，在声明 forwardRef 函数时使用了 Flow 泛型，部分代码：

```js
export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  if (__DEV__) {
    // ...
  }
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}
```

这里使用了 `Flow` 的 `Generic Types（泛型类型）`，函数 `forwardRef` 有两个类型参数 `Props` 和 `ElementType`（其类型是 `React$ElementType`），函数 `forwardRef` 的参数 `render` 是一个函数，该函数有两个参数 `props`（使用了类型参数 `Props`）和 `ref`（它是传入了 `ElementType` 这个类型参数的 `React$Ref` 泛型类型），`render` 这个函数的返回值是 `React$Node` 类型。

这段代码应用了 `Flow` 泛型的多个语法特性：

1. [Functions with generics](https://flow.org/en/docs/types/generics/#toc-functions-with-generics)
2. [Create as many generics as you need](https://flow.org/en/docs/types/generics/#toc-create-as-many-generics-as-you-need)
3. [Adding types to generics](https://flow.org/en/docs/types/generics/#toc-adding-types-to-generics)
4. [Parameterized generics](https://flow.org/en/docs/types/generics/#toc-parameterized-generics)
