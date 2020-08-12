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

const getDetail = (id) => {
  return {
    id: 1,
    title: '标题A',
    content: '内容A',
    createTime: 1597216343115,
    author: '安鸿鹏'
  }
}

module.exports = {
  getList,
  getDetail
}
