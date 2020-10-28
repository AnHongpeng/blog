// 访问属性：
//   public：允许属性在「类内」和「类外」使用
//   private：只允许属性在「类内」使用
//   protected：允许在「类内」和「继承的子类中」使用
class Person {
  private name: string; // 默认是 public 访问类型
  protected age: number;
  public sayHi() {
    console.log(this.name) // 类内使用 name
    console.log(this.age) // 类内使用 age
    console.log('hi')
  }
}

// Teacher 是 Person 的子类
class Teacher extends Person {
  public sayBye() {
    console.log(this.age) // protected 允许在继承的子类中使用
  }
}

const person = new Person();
person.name = '小安'; // 类外使用 name，报错
console.log(person.name); // 类外使用 name，报错
console.log(person.age); // 类外使用 age，报错
person.sayHi();

// constructor 中传参的简写
class Person2 {
  // 传统写法
  // public name: string;
  // constructor(name: string) {
  //   this.name = name
  // }

  // 简化写法
  constructor(public name: string) {}
}
const person2 = new Person2('小安');
console.log(person2.name)

// 子类的 constructor() 中必须手动调用 super()
class Person3 {
  constructor(public name: string) {}
}

class Teacher3 extends Person3 {
  constructor(public age: number) {
    super('小安')
  }
}

const teacher3 = new Teacher3(18)
