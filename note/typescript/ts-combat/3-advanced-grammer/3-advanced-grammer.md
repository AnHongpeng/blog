# TypeScript 语法进阶

## TypeScript 中的配置文件

项目目录中，执行 `tsc --init` 会初始化项目并生成 `tsconfig.json` 的配置文件。在 `tsconfig.json` 中配置 TS 如何进行编译。

使用 `tsc` 指令指定编译某个文件时，并不会用到 `tsconfig.json` 中的配置内容。只有直接执行 `tsc` 指令（后面不带任何内容）时，才会使用当前目录下 `tsconfig.json` 的配置。

直接执行 `tsc` 指令后：

1. 先到 `tsconfig.json` 中读取配置项
2. `tsconfig.json` 会默认配置成对所在根目录下文件进行编译

### `tsconfig.json` 中的 `include`、`exclude` 和 `files`：

* `include`：指定想要编译的文件名或匹配模式
* `exclude`：指定想要排除掉的，不编译的文件名或匹配模式
* `files`：指定想要编译的文件名，如果需要写匹配模式，需要用 `include`

详细的 `tsconfig.json` 的配置说明请参考 [TSConfig Reference](https://www.typescriptlang.org/tsconfig)

### 常用的 `compilerOptions` 编译配置

* `removeComments`：编译时是否剔除注释
* `strict`：设为 `true` 意味着所有严格类型检查都会被开启
* `noImplicitAny`：默认是 `true`，意味着不允许隐式的 `any` 类型声明（必须显式定义 `any`）
* `strictNullChecks`：默认是 `true`，意味着不允许把 `null` 赋值给其他基本类型变量

详细的编译配置，可参考 [Compiler Options in MSBuild](https://www.typescriptlang.org/docs/handbook/compiler-options-in-msbuild.html)

## 联合类型和类型保护

联合类型：联合类型（Union Types）表示取值可以为多种类型中的一种。

类型保护：能够在特定的区块中保护变量属于某种确定的类型，可以在此区块中放心的引用此类型的属性，或者调用此类型的方法。

类型保护的常见方式：

* 类型断言
* in 语法
* typeof 语法
* instanceof 语法

Eg.使用断言完成类型保护：

``` ts
interface Bird {
  fly: boolean;
  sing: () => {};
}

interface Dog {
  fly: boolean;
  bark: () => {}
}

function trainAnimail(animal: Bird | Dog) {
  // 如果 animal.fly 值为 true，那么通过「断言」的方式认定 animal 类型就是 Bird
  if (animal.fly) {
    (animal as Bird).sing()
  } else {
    (animal as Dog).bark()
  }
}
```

Eg.使用 in 语法完成类型保护：

``` ts
function trainAnimailSeconde(animal: Bird | Dog) {
  if ('sing' in animal) {
    animal.sing()
  } else {
    animal.bark() // 注意这里 TS 可以自动推算出来
  }
}
```

Eg.使用 typeof 语法来做类型保护：

``` ts
function add(first: string | number, second: string | number) {
  if (typeof first === 'string' || typeof second === 'string') {
    return `${first}${second}`
  }
  return first + second;
}
```

Eg.使用 instanceof 语法来做类型保护：

``` ts
class NumberObj {
  count: number
}

function addSecond(first: object | NumberObj, second: object | NumberObj) {
  if (first instanceof NumberObj && second instanceof NumberObj) {
    return first.count + second.count;
  }
  return 0;
}
```

## Enum 枚举类型

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

编码示例：

``` ts
enum Status {
  // OFFLINE = 1,
  OFFLINE,
  ONLINE,
  DELETED
}

console.log(Status.OFFLINE);
console.log(Status.ONLINE);
console.log(Status.DELETED);
console.log(Status[0]); // OFFLINE

function getResult(status) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  } else if (status === Status.DELETED) {
    return 'deleted';
  }
  return 'error';
}

// const result = getResult(Status.OFFLINE);
const result = getResult(1); // online
console.log(result);
```
