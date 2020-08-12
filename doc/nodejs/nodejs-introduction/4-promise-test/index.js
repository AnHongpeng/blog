const fs = require('fs') // 文件操作
const path = require('path') // 操作文件路径

// callback 方式获取一个文件的内容
// function getFileContent(fileName, callback) {
//   // 绝对路径。__dirname 是当前文件目录
//   const fullFileName = path.resolve(__dirname, 'files', fileName)

//   fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     callback(JSON.parse(data.toString()))
//   })
// }

// 测试 callback-hell 回调地狱
// getFileContent('a.json', aData => {
//   console.log('a data', aData)
//   getFileContent(aData.next, bData => {
//     console.log('b data', bData)
//     getFileContent(bData.next, cData => {
//       console.log('c data', cData)
//     })
//   })
// })

// 用 Promise 获取文件内容
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', fileName)

    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(JSON.parse(data.toString()))
    })
  })
  return promise
}

getFileContent('a.json')
  .then(aData => { // then() 方法返回 promise 实例，以进行连缀调用
    console.log('a Data', aData)
    return getFileContent(aData.next)
  })
  .then(bData => {
    console.log('b Data', bData)
    return getFileContent(bData.next)
  })
  .then(cData => {
    console.log('c Data', cData)
  })
