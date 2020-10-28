// 一、数组
const numberArr = [1, 2, 3] // 类型是 number[]
const stringArr = ['a', 'b', 'c'] // 类型是 string[]
const undefinedArr: undefined[] = [undefined, undefined]
const arr: (number | string)[] = [1, '2', 3] // 类型是包含数字或字符串的数组

// 数组元素是对象
const objectArr: { name: string, age: number }[] = [{
  name: '小安',
  age: 18
}]

// 类型别名 type alias
type User = { name: string, age: number }
const objecrArr2: User[] = [{
  name: '小安',
  age: 18
}]

// 类在数组中的使用
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
