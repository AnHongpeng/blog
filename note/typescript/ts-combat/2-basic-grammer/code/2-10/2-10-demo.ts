// 类的定义与继承

// 定义一个类
class Person {
  name = '小安'
  getName() {
    return this.name
  }
}

// 类的继承
class Teacher extends Person {
  getTeacherName() {
    return '老师'
  }
  getName() {
    return super.getName() + '在子类中重写了父类的原型方法'
  }
}

const person = new Person()
console.log(person.getName()) // 小安

const teacher = new Teacher()
console.log(teacher.getName()) // 小安在子类中重写了父类的原型方法
console.log(teacher.getTeacherName()) // 老师
