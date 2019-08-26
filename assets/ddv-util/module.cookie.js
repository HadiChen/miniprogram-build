import Cookies from 'js-cookie'

export default moduleCookie

function moduleCookie (ddvUtil, context, inject) {
  ddvUtil.cookie = context.cookie = DdvCookies.bind(ddvUtil)
}
function DdvCookies () {
  if (arguments.length > 1) {
    return setDdvCookies.apply(this, arguments)
  } else {
    return getDdvCookies.apply(this, arguments)
  }
}
function setDdvCookies (key, value, attributes) {
  if (process.server) {
    if (this.$res && this.$res.cookie) {
      return this.$res.cookie(key, value, attributes)
    }
  } else if (process.browser) {
    return Cookies.set(key, value, attributes)
  } else {
    throw new Error('未知终端')
  }
}
function getDdvCookies (key) {
  if (process.server) {
    if (this.$req && this.$req.cookies) {
      return this.$req.cookies[key]
    }
  } else if (process.browser) {
    return Cookies.get(key)
  } else {
    throw new Error('未知终端')
  }
}
