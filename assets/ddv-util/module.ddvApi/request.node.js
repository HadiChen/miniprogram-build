// 一定要导出提前
export default request

var http = require('http')
var https = require('https')
var url = require('ddv-auth/util/url')
var excludeBaseKeys = [
  'host',
  'cookie',
  'date',
  'connection',
  ':authority',
  ':method',
  ':path',
  ':scheme',
  'accept-encoding',
  'if-modified-since',
  'if-none-match',
  'x-forwarded-host'
]

// 发送请求
function request (uri, body, method, headers, nodeOpt) {
  return new Promise(function (resolve, reject) {
    var excludeKeys = excludeBaseKeys.concat([])
    if (typeof headers !== 'object') {
      headers = {}
    }
    Object.keys(headers || {}).forEach(key => {
      key && excludeKeys.push((key || '').toLowerCase())
    })
    Object.keys(((nodeOpt && nodeOpt.headers) || {})).forEach(key => {
      if ((!key) || excludeKeys.indexOf((key || '').toLowerCase()) > -1) {
        return
      }
      headers[key] = nodeOpt.headers[key]
    })
    var req, uriOpt
    uriOpt = url.parse(uri)
    var opt = {
      method,
      headers,
      host: uriOpt.host,
      protocol: uriOpt.protocol || (uriOpt.scheme + ':'),
      path: (uriOpt.query ? (uriOpt.path + '?' + uriOpt.query) : uriOpt.path)
    }

    if (uriOpt.port) {
      opt.port = uriOpt.port
    }

    if ((!(opt.headers.host || opt.headers.Host))) {
      opt.headers.Host = opt.host
    }
    uriOpt = void 0
    // 发送请求
    req = (opt.protocol === 'http:' ? http : https).request(opt, function (response) {
      var serverRes = {}
      serverRes.body = ''
      response.on('data', function (data) {
        serverRes.body += data
      }).on('end', function () {
        serverRes.headers = response.headers || Object.create(null)
        serverRes.rawHeaders = response.rawHeaders || []
        serverRes.statusCode = response.statusCode || 200
        serverRes.statusMessage = response.statusMessage.toString() || 'UNKNOW_ERROR'
        serverRes.status = serverRes.statusMessage
        if (serverRes.status < 200 || serverRes.status >= 400) {
          serverRes.uri = uri
          serverRes.method = method
          serverRes.headers = headers
        }
        uri = body = method = headers = void 0
        serverRes.statusCode >= 200 && serverRes.statusCode < 300 ? resolve(serverRes) : reject(serverRes)
      })
    })
    if (body) {
      req.write(body)
    }
    req.on('error', function (e) {
      Object.assign(e, this)
      reject(e)
    })
    req.end()
    opt = req = void 0
  })
}
