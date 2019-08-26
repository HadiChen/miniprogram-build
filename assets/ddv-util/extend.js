import util from 'ddv-util'
import utilTime from 'ddv-util/time'
import ddvRestFulApi from 'ddv-restful-api/api.js'

/* *********************临时开始********************* */
import tools from '@/assets/util/util.js'

util.extend({
  util: tools
})
/* *********************临时结束********************* */

// 扩展时间模块
util.extendInit(utilTime)

util.extend({
  sleep,
  isUrlPathEqual,
  isUrlHostEqual,
  isESModule,
  getDefault,
  getError,
  getDataByErrorBody,
  CancelError
})

// 获取一个错误
function getError (message, name, errorId, stack) {
  if (this instanceof getError) {
    return getError(message, name, errorId)
  } else {
    var e = new Error(message || 'Unknown Error')
    e.name = name || errorId || e.name
    e.errorId = errorId || e.name
    if (stack) {
      e.stack = e.stack + '\n' + stack
    }

    return e
  }
}

function CancelError (message) {
  if (this instanceof CancelError) {
    let e = new Error(message || '取消操作')
    e.name = 'CancelError'
    e.ErrorId = 'CancelError'
    return e
  } else {
    return new CancelError(message)
  }
}

// 判断模板url和当前url的主机头是否一致
function isUrlPathEqual (url, checkUrl) {
  var state = false
  try {
    state = ddvRestFulApi.url.parse(url).path === ddvRestFulApi.url.parse(checkUrl).path
  } catch (e) {
    state = false
  }
  return state
}
// 判断模板url和当前url的主机头是否一致
function isUrlHostEqual (url, checkUrl) {
  var state = false
  try {
    state = ddvRestFulApi.url.parse(url).host === ddvRestFulApi.url.parse(checkUrl).host
  } catch (e) {
    state = false
  }
  return state
}

function getDefault (obj) {
  return obj['default'] || obj
}

const hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol'

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

function getDataByErrorBody (e, key) {
  var data = {}
  if (e.body) {
    try {
      Object.assign(data, JSON.parse(e.body))
    } catch (e) {

    }
  }
  if (key) {
    data = data[key] || null
  }
  return data
}

function sleep (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}
