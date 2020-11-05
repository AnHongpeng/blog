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
  name: string;
  age: number;
}

const teacherArr: Teacher[] = [
  new Teacher(),
  { // 该对象虽然不是 new Teacher() 生成的实例，但也满足 Teacher 实例的要求
    name: '小安',
    age: 18
  }
]

// 二、元组 tuple：元素的个数和类型固定的数组
// 元组的定义：
// 如果 teacherInfo 类型是 (number | string)[]，并不能满足顺序上的要求
const teacherInfo: [string, string, number] = ['小安', 'male', 18]

// 元组的应用场景：读取 Excel、csv 文件时
const teacherList: [string, string, number][] = [
  ['小安', 'male', 18],
  ['源宝', 'male', 12],
  ['小红', 'female', 12]
]
