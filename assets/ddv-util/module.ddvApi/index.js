import ddvRestFulApi from 'ddv-restful-api/api.js'
import onAccessKeyFn from 'ddv-restful-api/lib/onAccessKey.js'
import session from 'ddv-restful-api/lib/session'
import request from './request.js'
import apiConfig from '@/api.config.js'
import uploadApi from 'ddv-upload-api'

// 判断数据
function decideData (data) {
  switch (typeof data) {
    case 'function':
    case 'boolean':
    case 'undefined':
      return false
    default:
      if (Array.isArray(data)) {
        return data.length > 0
      } else {
        return data || data === 0
      }
  }
}

// 是否长期会话
session.setLongStorage(false)
// 设置初始化session的path，默认/session/init
session.setSessionInitPath('/session/init')
// 导出模块
export default moduleDdvApi

function moduleDdvApi (ddvUtil, context, inject) {
  // 扩展 ddvApi
  ddvUtil.ddvApi = ddvUtil.ddvApi || ddvRestFulApi.getApi()
  // 扩展 ddvApi业务逻辑
  ddvUtil.ddvApi.protoExtend.validHeaders = function (opts) {
    let headerData = Object.create(null)

    if (typeof opts === 'object' && opts) {
      if (decideData(opts.salesId)) {
        headerData['x-ddv-select-sales-uid'] = opts.salesId
      }

      if (decideData(opts.projectId)) {
        headerData['x-ddv-select-site-id'] = opts.projectId
      }

      if (decideData(opts.uids)) {
        headerData['x-ddv-select-sales-level-uids'] = opts.uids
      }
    } else if (decideData(opts) && ddvUtil.$vm.isUseSiteLists) {
      headerData['x-ddv-select-site-id'] = opts
    }
    this.headers(headerData)
    return this
  }
  // 设置会话初始化最大自动尝试次数，默认3次
  ddvUtil.ddvApi.setOnAccessKeyTrySum(3)
  ddvUtil.ddvApi.setHeadersPrefix('x-ddv-')
  ddvUtil.ddvApi.onAccessKey = function onAccessKey (auth, _req, _res, tryNum) {
    return onAccessKeyFn(auth, context.req, context.res, tryNum)
  }
  ddvUtil.ddvApi.request = request.bind({
    headers: (context.req && context.req.headers) || {}
  })

  ddvUtil.ddvApi.setOnModelInitend(function (model) {
    model.headers({
      'x-ddv-from-host': ddvUtil.getHost(),
      'x-ddv-restful-api': 1
    })
  })

  apiConfig(ddvUtil.ddvApi, session, context.req && context.req.headers, ddvUtil.userAgent)
  // 支持
  ddvUtil.extendInit(ddvUtil.ddvApi.util)

  uploadApi.setApi(ddvUtil.ddvApi)
  ddvUtil.upload = uploadApi
}
