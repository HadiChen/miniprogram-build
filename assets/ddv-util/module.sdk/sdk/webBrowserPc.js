
export default WebBrowserPcSdk

function WebBrowserPcSdk () {
  if (this instanceof WebBrowserPcSdk) {
    return constructor.apply(this, arguments)
  } else {
    throw new Error('DdvSdk')
  }
}

WebBrowserPcSdk.prototype = {
  // 微信js-sdk
  ap: null,
  // 支付宝appId
  // appId: null,
  // 是否调试模式
  debug: false,
  // 是否已经初始化
  inited: false,
  // 默认的自动授权模式
  scope: 'auth_base', // 'auth_base,auth_user'
  // 初始化
  init,
  // 是否初始化方法
  isInit,
  // 关闭窗口
  closeWindow,
  // 构造函数
  constructor,
  // 静默授权
  autoBaseOauth
}
// 构造函数
function constructor (sdk) {
  this.sdk = sdk
  this.ddvUtil = sdk.ddvUtil
}
// 初始化
function init (sdk) {
  if (this.inited) {
    return Promise.resolve()
  }
  this.inited = true
  return Promise.resolve()
}

// 是否需要自动静默授权
function autoBaseOauth () {
  return Promise.resolve()
}

function closeWindow (sdk) {
  return this.isInit()
  .then(_ => {
    window.close()
  })
}

function isInit () {
  if (this.inited) {
    return Promise.resolve(this)
  }
  return Promise.reject(new Error('not inited'))
}
