interface Point { x: number, y: number }

// 利用勾股定理求斜边长度
function tsDemo(data: Point) {
  return Math.sqrt(data.x ** 2 + data.y ** 2)
}

tsDemo({ x: 3, y: 4 })
