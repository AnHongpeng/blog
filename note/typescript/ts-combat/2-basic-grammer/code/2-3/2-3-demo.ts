interface Point {
  x: number,
  y: number
}

const point: Point = { // point 上就会具备 Point 类型的所有属性和方法
  x: 3,
  y: 4
}

const count: number = 2019 // 之后，count 会具备 number 这个类型的所有属性和方法
