/**
 * @File：系统基本配置
 */

const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    // 非 POST 请求，返回 {}
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    // 请求格式非 application/json，返回 {}
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandler = (req, res) => {
  // 设置返回格式 JSON。它还是返回一个字符串，只不过字符串格式是 JSON
  res.setHeader('Content-Type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0] // 一次性计算 path 后赋给 req

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 postData
  getPostData(req).then(postData => {
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 处理 user 路由
    const userData = handleUserRouter(req, res)
    if (userData) {
      res.end(JSON.stringify(userData))
      return
    }

    // 未命中路由，返回 404
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('404 Not Found\n')
    res.end()
  })
}

module.exports = serverHandler

// process.env.NODE_ENV // 当前环境
