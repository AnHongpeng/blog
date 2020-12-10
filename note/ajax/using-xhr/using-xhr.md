# 使用 XMLHttpRequest

## 提交表单和上传文件

`XMLHttpRequest` 的实例有两种方式提交表单：

* 使用 AJAX
* 使用 FormData API

第二种方式（使用 `FormData` API）是最简单最快捷的，但是缺点是被收集的数据无法使用 `JSON.stringify()` 转换为一个 JSON 字符串。

只使用 AJAX 则更为复杂，但也更灵活、更强大。

## 参考文档

* [使用 XMLHttpRequest | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
* [在 Web 应用程序中使用文件](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications)
