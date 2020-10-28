# TypeScript 基础语法入门

## TypeScript 的定义

官网定义：

> Typed JavaScript at Any Scale.
>
> TypeScript extends JavaScript by adding types.
>
> By understanding JavaScript, TypeScript saves you time catching errors and providing fixes before you run code.
>
> Any browser, any OS, anywhere JavaScript runs. Entirely Open Source.

TypeScript 是适用于任何规模应用的 JavaScript。

TypeScript 扩展了 JavaScript ，为它添加了类型支持。

TypeScript 可以在您运行代码之前找到错误并提供修复，从而改善您的开发体验。

在任何浏览器、任何操作系统、任何能运行 JavaScript 的地方都可以运行 TypeScript，而且完全开源。

* TypeScript 是 JavaScript 的超集，就好比 ES6 是 ES5 的超集。也就是说，TypeScript 除了包含像 ES5、ES6 这类 JS 特性外，还包含自身独特的一些语言特性；
* TypeScript 中的类型是「静态类型」；
* TypeScript 不能直接在浏览器或 NodeJS 环境下运行，需要通过编译器把它编译成普通的 JavaScript 之后再去运行；

## TypeScript 带来了什么优势

* 优势1：TS 的静态类型，使得我们在开发阶段就能发现潜在的问题
* 优势2：编辑器提供更友好的代码提示
* 优势3：代码即文档。代码语义更清晰易懂

## TypeScript 基础环境搭建

1. 想要运行 TS，先要有 NodeJS 环境
2. `npm install typescript -g`
3. 可选：`npm i -g ts-node`，然后 `ts-node demo.ts`

## 静态类型的深度理解

静态类型，不仅仅意味着类型不可修改，还意味着这个类型上的属性和方法基本上已经确定了。正因为这样，在使用静态类型时，编辑器才能给我们友好的提示。

## 概括总览基础类型和对象类型

基础类型包括：number、string、boolean、null、undefined、symbol、void 等
对象类型包括：对象、数组、函数、类等

## 类型注解和类型推断

* 类型注解：type annotation，我们显式地声明来告诉 TS 变量是什么类型；
* 类型推断：type inference，TS 会自动地尝试分析变量的类型；

正确用法：

* 如果 TS 能自动分析变量类型，我们就什么也不需要做了
* 如果 TS 无法分析变量类型的话，我们就需要使用「类型注解」了

总之，无论是被动地让 TS 自动推断类型，还是主动地使用类型注解，目的都是使得所有变量都有确定的类型。这样程序的执行是可预测的。

## 注解函数

设置函数返回值的类型注解：

``` ts
function add(first: number, second: number): number {
  return first + second + '' // 这样就会报错
}
const total = add(1, 2)
```

函数没有返回值：

``` ts
function sayHello(): void {
  console.log('hello')
  return '' // 这样就会报错
}
```

函数永远不可能执行到最后：

``` ts
function errorEmmitter(): never {
  throw new Error()
  console.log('我没法执行完')

  // while(true) {} // 或者一直在循环做一些事情
}
```

函数参数接收解构的内容，如何进行类型注解：

``` ts
function add2(
  { first, second }: { first: number, second: number }
): number {
  return first + second
}
const total2 = add2({ first: 1, second: 2 })
```

在使用1个属性的解构语法时，很容易写错：
``` ts
function getNumber({ first }: { first: number }) {
  return first
}

const number = getNumber({ first: 1 })
```

## 数组、元组与类型别名

### 数组

相同类型的数组元素：

``` ts
const numberArr = [1, 2, 3] // 类型是 number[]
const stringArr = ['a', 'b', 'c'] // 类型是 string[]
const undefinedArr: undefined[] = [undefined, undefined]
```

不同类型的数组元素：

``` ts
const arr: (number | string)[] = [1, '2', 3] // 类型是包含数字或字符串的数组
```

数组元素是对象：

``` ts
const objectArr: { name: string, age: number }[] = [{
  name: '小安',
  age: 18
}]
```

类型别名 type alias：

``` ts
type User = { name: string, age: number }
const objecrArr2: User[] = [{
  name: '小安',
  age: 18
}]
```

类在数组中的使用：

``` ts
class Teacher {
  name: string,
  age: number
}

const teacherArr: Teacher[] = [
  new Teacher(),
  { // 该对象虽然不是 new Teacher() 生成的实例，但也满足 Teacher 实例的要求
    name: '小安',
    age: 18
  }
]
```
