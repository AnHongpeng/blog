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
