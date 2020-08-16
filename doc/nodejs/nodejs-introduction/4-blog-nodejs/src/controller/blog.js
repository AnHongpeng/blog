const { exec } = require('../db/mysql')

// 获取博客列表 - GET
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  // 返回 promise
  return exec(sql)
}

// 获取博客详情 - GET
const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => rows[0])
}

// 新建博客 - POST
// @blogData：博客对象，包含 title、content 等属性
const newBlog = (blogData = {}) => {
  const { title, content, author } = blogData
  const createtime = Date.now()

  const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${createtime}, '${author}');
  `

  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
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
