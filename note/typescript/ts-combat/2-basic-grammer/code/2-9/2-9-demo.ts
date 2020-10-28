// 通用的类型集合，可以使用 interface 定义出来
interface Person {
  readonly name: string; // 该 name 属性只读
  age?: number; // 该 age 属性可有可无
  [propName: string]: any; // 定义额外的属性
  say(): string; // 有 say 方法，返回值是 string 类型
}

// interface 之间可以相互继承
interface Teacher extends Person {
  teach(): string;
}

// interface 和 type 类似，但并不完全相同
// 类型别名 type 和接口 interface 的区别：
// 1.interface 没法代表一个基础类型
// 2.规范是能用 interface 尽量用 interface，实在不行再用 type
type Person1 = {
  name: string
}

// 类，可以应用接口。这要求类的实例要与 interface 相匹配
class User implements Person {
  name = '小安'
  say() {
    return 'hello'
  }
}

// interface 还可以用来定义函数的类型
interface SayHi { // 函数类型是 SayHi
  (word: string): string
}

const getPersonName = (person: Person): void => {
  console.log(person.name)
}

const setPersonName = (person: Teacher, name: string): void => { // 如果 person 传入 undefined，语句就会报错
  person.name = name // 这里就会报错，因为 name 属性设成的是只读
}

const person = {
  name: '小安',
  sex: 'male', // 这里不会报错
  say() {
    return 'say hello'
  },
  teach() {
    return 'teach'
  }
}

getPersonName(person)
setPersonName(person, '源宝')

getPersonName({
  name: '小安',
  sex: 'male', // 这里会报错，直接传字面量，TS 会进行类型的强校验。除非 interface 中加入 [propName: string]: any;
  say() {
    return 'say hello'
  }
})

const say: SayHi = (word: string) => {
  return word
}
