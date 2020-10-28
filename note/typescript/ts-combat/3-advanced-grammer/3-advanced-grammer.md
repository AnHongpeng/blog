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
