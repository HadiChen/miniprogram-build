import requestBrowser from './request.browser'
var requestNode
// 一定要导出提前
export default request

process.server && requestNodeInit()
function requestNodeInit () {
  return import('./request.node')
    .then(res => (res['default'] || res))
    .then(requestNodeRes => {
      requestNode = requestNodeRes
    })
}

// 发送请求
function request (uri, body, method, headers) {
  method = method || 'GET'
  if (process.server) {
    if (requestNode) {
      return requestNode(uri, body, method, headers, (this || {}))
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('失败'))
      })
    }
  } else if (process.browser) {
    return requestBrowser(uri, body, method, headers)
  } else {
    return new Promise(new Error('未知平台'))
  }
}
