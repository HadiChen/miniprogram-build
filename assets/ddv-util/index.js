import Vue from 'vue'
import moduleRoute from './module.route.js'
import moduleDdvApi from './module.ddvApi'
import moduleSdk from './module.sdk'
import moduleUserAgent from './module.userAgent'
import moduleCookie from './module.cookie'
import moduleAutoRetry from './module.autoRetry.js'
import moduleSiteConfig from './module.siteConfig'
import moduleDdvReady from './module.ddvReady'
import moduleVueI18n from './module.vueI18n'
import moduleLoginBox from './module.loginBox'
import getDdvUtil from '@/ddvcms/util/ddv-util'

// 导出模块
export default DdvUtilModule

function DdvUtilModule (context, inject) {
  // 支持 上下文使用ddvUtil
  context.ddvUtil = context.ddvUtil || getDdvUtil({}, [
    {
      computed: {
        isUseSiteLists () {
          return this.getStorage('adminSite', 'isUseLists', false)
        }
      }
    }
  ])
  // ddvUtil 加入 $context
  context.ddvUtil.$context = context.ddvUtil.$context = context
  // ddvUtil 加入 $store
  context.ddvUtil.$store = context.ddvUtil.store = context.store
  // Vue
  context.ddvUtil.$Vue = Vue
  // ddvUtil 加入 $req
  context.ddvUtil.$req = context.ddvUtil.req = context.req || null
  // ddvUtil 加入 $res
  context.ddvUtil.$res = context.ddvUtil.res = context.res || null
  context.ddvUtil.isDev = context.isDev || false
  // 当前程序运行环境是否为浏览器
  context.ddvUtil.isBrowser = process.browser
  // 当前程序运行环境是否为服务器
  context.ddvUtil.isServer = process.server

  if (typeof window !== typeof void 0) {
    window.$ddvUtil = context.ddvUtil
  }
  // 临时使用 - 过度期
  context.ddvUtil.globalInit('d', (typeof window !== typeof void 0 && window === window.window ? window : (typeof global !== typeof void 0 && global === global.global ? global : this)))

  context.ddvUtil.$res && context.ddvUtil.$res.on('end', () => {
    console.log('end')
  })
  context.ddvUtil.$res && context.ddvUtil.$res.on('close', () => {
    console.log('close')
  })
  context.ddvUtil.$res && context.ddvUtil.$res.on('aborted', () => {
    console.log('aborted')
  })
  // 注册 在vue实例中 this.$d
  inject('d', context.ddvUtil)
  // 注册 在vue实例中 this.$ddvUtil
  inject('ddvUtil', context.ddvUtil)
  return Promise.all([
    // 初始化 userAgent 模块
    moduleUserAgent(context.ddvUtil, context, inject),
    // 初始化 Cookies 模块
    moduleCookie(context.ddvUtil, context, inject),
    // 初始化路由模块
    moduleRoute(context.ddvUtil, context, inject),
    // 初始化 ddv-restful-api 模块
    moduleDdvApi(context.ddvUtil, context, inject),
    // 初始化站点配置
    moduleSiteConfig(context.ddvUtil, context, inject)
    // 初始化站点 继续 依赖模块
      .then(_ => Promise.all([
      // 站点 初始化完毕后 继续 初始化语言模块
        moduleVueI18n(context.ddvUtil, context, inject),
        // 初始化 sdk [注意，因为sdk是授权的依赖模块]
        moduleSdk(context.ddvUtil, context, inject)
      ])),
    // 登录框
    moduleLoginBox(context.ddvUtil, context, inject),
    // 初始化 autoRetry 模块
    moduleAutoRetry(context.ddvUtil, context, inject),
    // 初始化就绪
    moduleDdvReady(context.ddvUtil, context, inject)
  ])
    .then(_ => void 0)
}
// 引入更多扩展
require('./extend.js')
require('./extend.vue.js')
require('./extend.locutus.php.js')
