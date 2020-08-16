const { loginCheck } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
  const method = req.method // GET POST

  // 登录
  if (method === 'POST' && req.path === '/api/user/login' ) {
    const { username, password } = req.body

    return loginCheck(username, password).then(data => {
      if (data.username) {
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }
}

module.exports = handleUserRouter
