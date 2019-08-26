import util from 'ddv-util'
// 导出模块
export default RouteModule

function RouteModule (ddvUtil, context, inject) {
  ddvUtil.xForwardedProto = true
  ddvUtil.getContext = () => context
  ddvUtil.getVueRoute = getVueRoute.bind(ddvUtil)
  ddvUtil.getVueRouter = getVueRouter.bind(ddvUtil)
  ddvUtil.getFullPath = getFullPath.bind(ddvUtil)
  ddvUtil.getProtocol = getProtocol.bind(ddvUtil)
  ddvUtil.isHttps = isHttps.bind(ddvUtil)
  ddvUtil.getHost = getHost.bind(ddvUtil)
  ddvUtil.getOrigin = getOrigin.bind(ddvUtil)
  ddvUtil.getQuery = getQuery.bind(ddvUtil)
  ddvUtil.getFullUri = getFullUri.bind(ddvUtil)
  ddvUtil.getNuxtRedirect = getNuxtRedirect.bind(ddvUtil)
  ddvUtil.isLocation = typeof location !== 'undefined'
  ddvUtil.redirect = redirect.bind(ddvUtil)
  // 是否服务器已经在重定向中
  ddvUtil.redirectByServerIng = false
  if (!ddvUtil.uriFrist) {
    ddvUtil.uriFrist = ddvUtil.getFullUri()
  }
  ddvUtil.getVueRouter().afterEach((to, from) => {
    handlerRouteChange.call(ddvUtil)
  })
}
function handlerRouteChange () {
  this.sdk.handlerRouteChange()
}
function getVueRoute () {
  return this.getContext().route
}
function getVueRouter () {
  return this.getContext().app.router
}
function getNuxtRedirect () {
  return this.getContext().redirect
}
function getFullPath () {
  return this.getVueRoute().fullPath
}
function getQuery () {
  return this.getVueRoute().query
}
function getProtocol () {
  var protocol
  if (this.isServer && this.getContext().req) {
    protocol = this.getContext().req.protocol
    if (!protocol && this.xForwardedProto) {
      protocol = this.getContext().req.headers['x-forwarded-proto']
    }
  } else if (this.isBrowser && this.isLocation) {
    protocol = location.protocol
  }
  if (protocol && protocol.indexOf('http') > -1 && this.isHttps()) {
    protocol = 'https:'
  } else if (!protocol && this.isHttps()) {
    protocol = 'https:'
  }
  if (protocol && protocol.substr(-1) !== ':') {
    protocol += ':'
  }
  return protocol
}
function getHost () {
  var host, req
  if (this.isServer) {
    req = this.getContext().req
    host = (req && (req.hostname || req.host || (req.headers && req.headers.host))) || host
  } else if (this.isBrowser && this.isLocation) {
    host = location.hostname || location.host || host
  }
  return host
}
function getOrigin () {
  return this.getProtocol() + '//' + this.getHost()
}
function getFullUri () {
  return this.getOrigin() + this.getFullPath()
}
function isHttps () {
  if (this.isServer && this.getContext().req) {
    return isHttpsByNode(this.getContext().req, this.xForwardedProto)
  } else if (this.isBrowser && this.isLocation) {
    return location.protocol === 'https:'
  } else {
    return false
  }
}
// 重定向
function redirect (uri, isReplace) {
  if (process.browser && util.isUrlHostEqual(uri, location.href) && this.getVueRouter()) {
    try {
      var uriObj = new URL(uri)
      uri = uriObj.pathname + (uriObj.search || '')
    } catch (e) {}
    // 本站点直接使用vue路由的方法，减少刷新
    if (isReplace === true) {
      this.getVueRouter().replace(uri)
    } else {
      this.getVueRouter().push(uri)
    }
  } else if (process.server) {
    if (this.redirectByServerIng === false) {
      this.redirectByServerIng = true
      return this.getNuxtRedirect()(302, uri)
    } else {
      // 防止后面的重定向覆盖前面的重定向
      return Promise.resolve()
    }
  } else if (typeof location !== 'undefined') {
    // 这个直接使用系统url地址跳转
    location.href = uri
    return Promise.resolve()
  } else {
    return this.getNuxtRedirect()(302, uri)
  }
}
function isHttpsByNode (req, xForwardedProto = true) {
  // Test using req.connection.encrypted
  const encrypted = isEmpty(req.connection.encrypted) ? null : req.connection.encrypted === true
  if (encrypted) {
    return true
  }

  // Test using req.protocol
  const httpsProtocol = isEmpty(req.protocol) ? null : req.protocol === 'https'
  if (httpsProtocol) {
    return true
  }

  // Test using x-forwarded-proto header
  const httpsXforwarded = (!xForwardedProto || isEmpty(req.headers['x-forwarded-proto'])) ? null
    : req.headers['x-forwarded-proto'].indexOf('https') !== -1
  if (httpsXforwarded) {
    return true
  }

  // If no detection method is available return null
  if (encrypted === null && httpsProtocol === null && httpsXforwarded === null) {
    return null
  }

  return false
}

function isEmpty (v) {
  return v === undefined || v === null
}
