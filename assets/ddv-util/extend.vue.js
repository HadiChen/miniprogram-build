import Vue from 'vue'
import util from 'ddv-util'
import VueI18n from 'vue-i18n'
import ElementUI, { Loading, MessageBox, Message, Notification } from 'element-ui'
// import DdvMultiWindow from 'ddv-multi-window'

import projectIdLists from '@/ddvcms/components/site-id-lists'
import languageIdLists from '@/ddvcms/components/language-id-lists'
import languageIdSelectLists from '@/ddvcms/components/language-id-select-lists'
import languageIdDropdownMenu from '@/ddvcms/components/language-id-dropdown-menu'
import salesListsSelectUid from '@/ddvcms/components/sales-lists-select-uid'

Vue.component('site-id-lists', projectIdLists)
Vue.component('language-id-lists', languageIdLists)
Vue.component('language-id-select-lists', languageIdSelectLists)
Vue.component('language-id-dropdown-menu', languageIdDropdownMenu)
Vue.component('sales-lists-select-uid', salesListsSelectUid)

const inBrowser = typeof window !== 'undefined'
// eslint-disable-next-line no-undef
const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform

util.extend({
  useVue,
  vueUtil: {
    logError,
    handleError,
    globalHandleError
  }
})

Vue.use(VueI18n)
Vue.use(Loading.directive)
Vue.use(ElementUI)
// Vue.use(DdvMultiWindow)

Vue.filter('d', util)
Vue.filter('ddvUtil', util)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$ELEMENT = { size: 'small' }
Vue.prototype.$MessageBox = MessageBox

Vue.prototype.$setTimeoutLast = setTimeoutLast
Vue.prototype.$replaceRouterByObj = replaceRouterByObj
Vue.prototype.$tryReplaceRouterMethod = tryReplaceRouterMethod
Vue.prototype.$runReplaceRouterMethod = runReplaceRouterMethod

// 批量使用vue
function useVue (...args) {
  args.forEach(t => t.name ? Vue.component(t.name, t) : Vue.use(t))
}

function replaceRouterByObj (obj) {
  this.$router.replace({
    query: d.util.compactObj(Object.assign({}, this.$route.query, obj))
  })
}
/**
 *
 * @param {fn[Fuction]}  回调方法
 * @param {timer[Number]} 时间
 * @param {_this[object]} vue实例化对象
 */
function setTimeoutLast (fn, timer) {
  timer = typeof timer === 'number' ? timer : 500
  this._$setTimeoutLastTimer && clearTimeout(this._$setTimeoutLastTimer)
  this._$setTimeoutLastTimer = setTimeout(fn, timer || 500)
  return this
}
function tryReplaceRouterMethod (data, methodName) {
  this.$setTimeoutLast(() => {
    this.$ddvUtil.autoRetry(() => this.$runReplaceRouterMethod(data, methodName))
  })
}
function runReplaceRouterMethod (data, methodName) {
  methodName = methodName || 'getLists'
  this.$replaceRouterByObj(data)
  return this[methodName]()
}

function handleError (err, vm, info) {
  if (vm) {
    let cur = vm
    while ((cur = cur.$parent)) {
      const hooks = cur.$options.errorCaptured
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) return
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info)
}
function globalHandleError (err, vm, info) {
  if (Vue.config.errorHandler) {
    try {
      return Vue.config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler')
    }
  }
  logError(err, vm, info)
}

function logError (err, vm, info) {
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(err)
  } else {
    throw err
  }
}
