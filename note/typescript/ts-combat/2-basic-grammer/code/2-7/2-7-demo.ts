// 基础类型：boolean, number, string, void, undefined, symbol, null
let count // 此时类型推断是 any
count = 123

// 对象类型：{}, Class, function, []

// 函数类型注解的 2 种方式
// eg. 传入字符串，转数字
const func = (str: string) => { // 这种写法，可以省略函数返回值类型 :number。所以返回值要考虑是否需要手动写类型注解
  return parseInt(str, 10)
}

const func1: (str: string) => number = (str) => { // 这种写法就不能省略，省略了会报错
  return parseInt(str, 10)
}

// 还有其他对象类型
const date = new Date() // Date 类型

// 其他 Case
// Case1
interface Person {
  name: string
}
const rawData = '{"name": "小安"}'
// 此时类型推断 newData 类型是 any。JSON.parse() 并不能帮助 TS 推断出具体类型
const newData: Person = JSON.parse(rawData)

// Case2
// 如果就想实现一开始 temp 是数字，后面变成字符串
let temp: number | string = 123
temp = '456'
