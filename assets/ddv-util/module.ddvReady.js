import Vue from 'vue'
import util from 'ddv-util'
import {Ready} from 'ddv-multi-window'

export default moduleDdvReady

function moduleDdvReady (ddvUtil, context, inject) {
  ddvUtil.ddvReady = new DdvReady(ddvUtil)
  inject('ddvReady', ddvUtil.ddvReady)
}

function DdvReady () {
  if (this instanceof DdvReady) {
    return this.constructor.apply(this, arguments)
  } else {
    throw new Error('DdvReady')
  }
}
DdvReady.prototype = {
  isInit: false,
  ddvReady: false,
  promises: null,
  constructor (ddvUtil) {
    this.$ddvUtil = ddvUtil
    this.$ready = new Ready()
    this.isInit = true
    this.promises = []
  },
  onReadyd (fn) {
    fn = util.isFunction(fn) ? fn : function () {}
    return this.ready().then(fn, e => {})
  },
  emitReady () {
    return this.$ready.emitReady()
  },
  ready (fn) {
    if (this.isInit !== true) {
      return Promise.reject(new Error('ready not instantiation'))
    }
    if (this.$ddvUtil.isBrowser) {
      return this.$ready.waitReady()
    } else {
      return Promise.resolve()
    }
  }
}

if (Vue.config && Vue.config.optionMergeStrategies && !Vue.config.optionMergeStrategies.ddvReadyd) {
  Vue.config.optionMergeStrategies.ddvReadyd = ddvReadydMerge
}

function ddvReadydMerge (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

// 3. 注入组件
Vue.mixin({
  mounted () {
    var handlers = this.$options && this.$options.ddvReadyd
    if (util.isFunction(handlers)) {
      handlers = [handlers]
    }
    if (handlers && this.$ddvReady && this.$ddvReady.ready) {
      this.$ddvReady.ready()
        .then(res => {
          if (Array.isArray(handlers)) {
            for (let i = 0, j = handlers.length; i < j; i++) {
              try {
                handlers[i].call(this)
              } catch (e) {
                util.vueUtil.handleError(e, this, 'ddvReadyd hook')
              }
            }
          }
        }, e => {
          util.vueUtil.handleError(e, this, 'ddvReadyd hook')
        })
    }
  }
})
