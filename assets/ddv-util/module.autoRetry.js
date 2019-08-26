import {
  MessageBox,
  Message
} from 'element-ui'
import util from 'ddv-util'

export default moduleAutoRetry

function moduleAutoRetry (ddvUtil, context, inject) {
  // 扩展 ddvApi

  // 扩展 ddvUtil 中的 autoRetry
  ddvUtil.autoRetry = ddvUtil.ddvApi.autoRetry
  // 扩展 context 中的 autoRetry
  context.autoRetry = ddvUtil.autoRetry
  // 监听 autoRetry 开始事件
  ddvUtil.autoRetry.onBegin(res => {

  })
  // 监听 autoRetry 成功事件
  ddvUtil.autoRetry.onThen(res => {
    // 成功 - 直接返回
    return res
  })
  // 监听 autoRetry 异常事件
  ddvUtil.autoRetry.onCatch((e, resolve, reject, reTry, options) => {
    // 浏览器
    if (process.browser) {
      context.isDev && console.error(e)

      // 没有登录
      if (e.exceptionId === 'NO_ACCOUNT_LOGIN') {
        var isOpenLoginBox = ddvUtil.$loginBox.isOpen()
        var isRedirectLogin = false

        if (options && options.onLoginNeed) {
          if (util.isFunction(options.onLoginNeed)) {
            var res = options.onLoginNeed(e, resolve, reject, reTry, options)
            if (res && res.then) {
              res.then(resolve, reject)
            }
            isOpenLoginBox = false
          } else if (options.onLoginNeed === 'back') {
            ddvUtil.getVueRoute.back()
            isOpenLoginBox = false
          } else if (options.onLoginNeed === 'none') {
            isOpenLoginBox = false
          } else if (options.onLoginNeed === 'toLoginPage') {
            isOpenLoginBox = false
            isRedirectLogin = true
          }
        } else {
          isRedirectLogin = true
        }

        if (isOpenLoginBox) {
          ddvUtil.$loginBox.open()
            .then(res => {
              // 登录成功，再试一次
              reTry()
            })
            .catch(e => {
              if (options && options.onLoginCancel) {
                if (util.isFunction(options.onLoginCancel)) {
                  options.onLoginCancel(e, resolve, reject, reTry, options)
                } else if (options.onLoginCancel === 'back') {
                  ddvUtil.getVueRoute.back()
                } else if (options.onLoginCancel === 'reject') {
                  reject(e)
                } else if (options.onLoginCancel === 'none') {
                  // 清空内存
                } else {
                  Message({
                    type: 'info',
                    message: e.message || '取消操作'
                  })
                }
              } else {
                Message({
                  type: 'info',
                  message: e.message || '取消操作'
                })
              }
            })
        } else if (isRedirectLogin) {
          // 重定向到登录页
          ddvUtil.redirect('/login?redirect=' + encodeURIComponent(ddvUtil.getFullPath()))
        }
      } else if (e === 'cancel') {
        Message({
          type: 'info',
          message: '取消操作'
        })
      } else if (e.name === 'CancelError') {
        Message({
          type: 'info',
          message: e.message || '取消输入'
        })
      } else {
        if (e.exceptionId === 'UNKNOW_ERROR' || e.message === 'Unknow Error') {
          MessageBox({
            type: 'error',
            title: '警告',
            message: '网络不稳定，请重试'
          })
        } else {
          MessageBox({
            type: 'error',
            title: '错误',
            message: e.message || e || '未知错误'
          })
        }
      }
      // 服务器
    } else if (process.server) {
      // 没有登录
      if (e.exceptionId === 'NO_ACCOUNT_LOGIN') {
        // 重定向到登录页
        ddvUtil.redirect('/login?redirect=' + encodeURIComponent(ddvUtil.getFullPath()))
      } else {
        reject(e)
      }
    } else {
      // 未知
      reject(e)
    }
  })
}
