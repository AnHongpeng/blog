/**
 * @File: 防抖函数与节流函数的实现
 * 防抖和节流的作用都是防止函数短时间内多次调用，防抖是将函数多次执行变为一次执行，节流是将函数多次执行变为每隔一段时间执行。
 */

/**
 * 带有立即执行选项的防抖函数
 * @param {function} func 回调函数
 * @param {number} wait 防抖时间间隔
 * @param {boolean} immediate 是否立即调用
 * @return {function}
 */
function debounce(func, wait = 50, immediate = true) {
  let timer, context, args

  const later = () => setTimeout(() => { // 职责：清空定时器，延迟执行情况下调用函数
    timer = null
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  return function(...params) {
    if (!timer) { // 若未设置延时器 timer
      timer = later()
      if (immediate) {
        func.apply(this, params)
      } else { // 非立即执行情况下，先缓存执行上下文和参数，之后供延迟执行函数调用
        context = this
        args = params
      }
    } else { // 已设置了延时器 timer
      clearTimeout(timer)
      timer = later()
    }
  }
}

/**
 * 节流函数
 * @param {function} func 回调函数
 * @param {number} wait 节流时间间隔
 * @param {object} options 如果想忽略首次函数的调用，传入 {leading: false}
 *                         如果想忽略末次函数的调用，传入 {trailing: false}
 * @return {function}
 */
_.throttle = function(func, wait, options) {
  var context, args, result
  var timeout = null
  var previous = 0

  if (!options) options = {}

  var later = function() { // 延迟执行函数
    previous = options.leading === false ? 0 : _.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  return function() {
    var now = _.now() // 获得当前时间戳

    if (!previous && options.leading === false) previous = now

    // 计算剩余的延迟执行时间
    var remaining = wait - (now - previous)
    context = this
    args = arguments

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      // 执行函数，并将 previous 标记为当前时间戳，便于下次调用函数时计算
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }

    return result
  }
}
