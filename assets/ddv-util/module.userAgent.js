export default moduleUserAgent

// 协议模块
function moduleUserAgent (ddvUtil, context, inject) {
  if (process.server && context.req && context.req.headers) {
    ddvUtil.userAgent = context.req.headers['user-agent']
  } else if (typeof navigator !== 'undefined' && navigator.userAgent) {
    ddvUtil.userAgent = navigator.userAgent
  }
}
