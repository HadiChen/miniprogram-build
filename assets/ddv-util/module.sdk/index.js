import util from 'ddv-util'

export default moduleSdk

// guid
const GUID_REGEXP = /^[?a-z0-9]{8}-[?a-z0-9]{4}-[?a-z0-9]{4}-[?a-z0-9]{4}-[?a-z0-9]{12}$/i

// 导出 sdk模块
function moduleSdk (ddvUtil, context, inject) {
  ddvUtil.sdk = new DdvSdk(ddvUtil)
  return ddvUtil.sdk.init()
}

function DdvSdk (ddvUtil) {
  if (this instanceof DdvSdk) {
    return constructor.apply(this, arguments)
  } else {
    throw new Error('DdvSdk')
  }
}
DdvSdk.prototype = {
  // 是否已经初始化
  inited: false,
  // 是否有加载第三方平台的sdk[openSdk]
  isHasOpenSdk: false,
  // 浏览器名字
  browserName: '未知浏览器',
  // 应用名字
  appName: '未知应用',
  // 应用类型
  appType: '未知平台',
  // 构造函数
  constructor,
  // 检查浏览器
  checkBrowser,
  // 关闭窗口
  closeWindow,
  // 获取第三方平台的sdk
  getOpenSdk,
  // 加载第三方平台的sdk
  loadOpenSdk,
  // 路由调用
  handlerRouteChange,
  // 加载第三方平台的sdk - 第一次加载完成的事件
  loadOpenSdkFirstEnd,
  // 初始化
  init,
  // 是否已经初始化
  isInit,
  // 是否为guid
  isGuid,
  // 加载回来的开发openSdk
  openSdk: null
}

// 构造函数
function constructor (ddvUtil) {
  // ddvUtil 句柄
  this.ddvUtil = ddvUtil
  // 获取浏览器代理
  this.userAgent = this.ddvUtil.userAgent
  // 初始化
  this.openSdk = {}
}
// 初始化
function init () {
  if (this.inited) {
    return Promise.resolve()
  }
  // 标记初始化
  this.inited = true
  // 检测浏览器
  this.checkBrowser()
  return this.getOpenSdk()
}
function handlerRouteChange () {
  var sdkName, promises
  promises = []
  for (sdkName in this.openSdk) {
    // 判断是否需要初始化
    if (this.openSdk.hasOwnProperty(sdkName)) {
      if (this.openSdk[sdkName] && util.isFunction(this.openSdk[sdkName].handlerRouteChange)) {
        // 初始化
        promises.push(this.openSdk[sdkName].handlerRouteChange())
      }
    }
  }
  return Promise.all(promises)
}
// 关闭窗口
function closeWindow () {
  // 获取第三方sdk
  return this.getOpenSdk(this.appName, this.appType)
  .then(sdk => {
    // 如果sdk支持closeWindow方法，就调用sdk的关闭
    if (sdk && util.isFunction(sdk.closeWindow)) {
      return sdk.closeWindow(sdk)
    } else {
      window.close()
    }
  })
}
// 获取第三方平台的sdk
function getOpenSdk (appName, appType) {
  return this.loadOpenSdk(appName, appType)
}
// 获取第三方平台的sdk
function loadOpenSdkFirstEnd (appName, appType) {
  return Promise.all([
    this.ddvUtil.$openAuth.autoBaseOauth()
  ])
}
// 获取第三方平台的sdk
function loadOpenSdk (appName, appType) {
  if (!this.isHasOpenSdk) {
    return Promise.resolve()
  }
  return this.isInit()
  // 组合sdk名字
  .then(() => (appName || this.appName || '') + util.php.ucfirst(appType || this.appType || ''))
  .then(sdkName => {
    // 如果已经加载了就直接返回
    if (this.openSdk[sdkName]) {
      return Promise.resolve(this.openSdk[sdkName])
    } else {
      return import('./sdk/' + sdkName + '.js')
      .then(res => util.getDefault(res))
      // 取得sdk
      .then(DdvUtilOpenSdk => {
        // 报错sdk
        this.openSdk[sdkName] = new DdvUtilOpenSdk(this)
        // 判断是否需要初始化
        if (this.openSdk[sdkName] && util.isFunction(this.openSdk[sdkName].init)) {
          // 初始化
          return this.openSdk[sdkName].init(this).then(() => this.openSdk[sdkName])
        }
      })
      // 试图静默授权
      .then(() => this.loadOpenSdkFirstEnd(appName, appType))
      // 试图返回sdk，并且回收变量 sdkName
      .then(() => {
        var sdk = this.openSdk[sdkName]
        sdkName = void 0
        return sdk
      })
    }
  })
}
// 检测浏览器
function checkBrowser () {
  this.browserName = '电脑浏览器'
  this.appName = 'webBrowser'
  this.appType = 'pc'
  this.isHasOpenSdk = false
}
// 是否已经初始化
function isInit () {
  if (this.inited) {
    return Promise.resolve(this)
  }
  return Promise.reject(new Error('not inited'))
}
// 是否全局guid
function isGuid (guid) {
  return guid && GUID_REGEXP.test(guid) && true
}
