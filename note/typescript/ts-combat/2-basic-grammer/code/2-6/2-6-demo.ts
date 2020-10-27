// 定义函数的方式
// function hello() {}
// const hello1 = function() {}
// const hello2 = () => {}

// 设置函数参数
// function add(first: number, second: number) { // 这种情况下，返回值可以自动推断出
//   return first + second
// }
// const total = add(1, 2)

// 设置函数返回值的类型注解
function add(first: number, second: number): number {
  return first + second + '' // 这样就会报错
}
const total = add(1, 2)

// 该函数没有返回值
function sayHello(): void {
  console.log('hello')
  return '' // 这样就会报错
}

// 这个函数永远不可能执行到最后
function errorEmmitter(): never {
  throw new Error()
  console.log('我没法执行完')

  // while(true) {} // 或者一直在循环做一些事情
}

// 函数参数接收解构的内容，如何进行类型注解
function add2(
  { first, second }: { first: number, second: number }
): number {
  return first + second
}
const total2 = add2({ first: 1, second: 2 })

// 在使用1个属性的解构语法时，很容易写错
function getNumber({ first }: { first: number }) {
  return first
}

const number = getNumber({ first: 1 })
