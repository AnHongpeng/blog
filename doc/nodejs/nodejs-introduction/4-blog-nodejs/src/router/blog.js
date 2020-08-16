const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const method = req.method // GET POST
  const { id } = req.query

  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''

    return getList(author, keyword).then(listData => new SuccessModel(listData))
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    return getDetail(id).then(detailData => new SuccessModel(detailData))
  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const author = 'zhangsan'
    req.body.author = author
    return newBlog(req.body)
      .then(data => new SuccessModel(data))
  }

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    return updateBlog(id, req.body).then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新博客失败')
      }
    })
  }

  // 删除一篇博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const author = 'zhangsan'
    return delBlog(id, author).then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }
}

module.exports = handleBlogRouter
