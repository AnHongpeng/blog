// 获取博客列表 - GET
const getList = (author, keyword) => {
  // 先返回假数据（格式是正确的）
  return [{
    id: 1,
    title: '标题A',
    content: '内容A',
    createTime: 1597216343115,
    author: '安鸿鹏'
  }, {
    id: 2,
    title: '标题B',
    content: '内容B',
    createTime: 1597216457466,
    author: '张三'
  }]
}

// 获取博客详情 - GET
const getDetail = (id) => {
  return {
    id: 1,
    title: '标题A',
    content: '内容A',
    createTime: 1597216343115,
    author: '安鸿鹏'
  }
}

// 新建博客 - POST
// @blogData：博客对象，包含 title、content 等属性
const newBlog = (blogData = {}) => {
  console.log('>>>>> New Blog Data:', blogData)

  return {
    id: 3 // 表示新建博客插入到数据表里的 id
  }
}

// 更新博客 - POST
const updateBlog = (id, blogData = {}) => {
  console.log('>>>>> Update Data:', id, blogData)
  return true
}

// 删除博客
const delBlog = (id) => {
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
