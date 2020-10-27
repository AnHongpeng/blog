// type annotation 类型注解：我们显式地声明来告诉 TS 变量是什么类型
// type inference 类型推断：TS 会自动地尝试分析变量的类型
// 正确用法：
// 如果 TS 能自动分析变量类型，我们就什么也不需要做了
// 如果 TS 无法分析变量类型的话，我们就需要使用「类型注解」了

// let count: number

// count = 123

// let countInference = 123 // 鼠标移入变量，TS 自动推断出 countInference 变量是 number 类型

// 这里不需要为 total 加类型注解，因为可以自动推断出
// const firstNumber = 1
// const secondNumber = 2
// const total = firstNumber + secondNumber

// 这种情况需要加类型注解
function getTotal(firstNumber: number, secondNumber: number) {
  return firstNumber + secondNumber
}

const total = getTotal(1, 2)
