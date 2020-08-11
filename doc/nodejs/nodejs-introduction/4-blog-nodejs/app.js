const serverHandler = (req, res) => {
  // 设置返回格式 JSON。它还是返回一个字符串，只不过字符串格式是 JSON
  res.setHeader('Content-Type', 'application/json')

  const resData = {
    name: '安鸿鹏',
    site: 'https://github.com/anhongpeng',
    env: process.env.NODE_ENV // 当前环境
  }

  res.end(JSON.stringify(resData))
}

module.exports = serverHandler
