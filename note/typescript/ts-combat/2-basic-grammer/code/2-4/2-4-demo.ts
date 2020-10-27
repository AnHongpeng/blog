// 基础类型。还有 null，undefined，symbol，boolean，void 等基本类型
const count: number = 123 // number
const teacherName: string = '小安' // string

// 对象类型
const teacher: { // 对象类型
  name: string,
  age: number
} = {
  name: '小安',
  age: 18
}

const numbers: number[] = [1, 2, 3] // 数组类型

class Person {}

const xiaoAn: Person = new Person() // class 类型。xiaoAn 必须是 Person 类的实例

const getTotal: () => number = () => { // 函数类型
  return 123
}
