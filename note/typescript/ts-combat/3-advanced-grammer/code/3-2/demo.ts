interface Bird {
  fly: boolean;
  sing: () => {};
}

interface Dog {
  fly: boolean;
  bark: () => {}
}

// 使用「联合类型」
// 「类型保护」的方式：
//   1.类型断言 
//   2.in 语法
//   3.typeof 语法
//   4.instanceof 语法

// 使用断言完成类型保护
function trainAnimail(animal: Bird | Dog) {
  // 如果 animal.fly 值为 true，那么通过「断言」的方式认定 animal 类型就是 Bird
  if (animal.fly) {
    (animal as Bird).sing()
  } else {
    (animal as Dog).bark()
  }
}

// 使用 in 语法完成类型保护
function trainAnimailSeconde(animal: Bird | Dog) {
  if ('sing' in animal) {
    animal.sing()
  } else {
    animal.bark() // 注意这里 TS 可以自动推算出来
  }
}

// 使用 typeof 语法来做类型保护
function add(first: string | number, second: string | number) {
  if (typeof first === 'string' || typeof second === 'string') {
    return `${first}${second}`
  }
  return first + second;
}

// 使用 instanceof 语法来做类型保护
class NumberObj {
  count: number
}

function addSecond(first: object | NumberObj, second: object | NumberObj) {
  if (first instanceof NumberObj && second instanceof NumberObj) {
    return first.count + second.count;
  }
  return 0;
}
