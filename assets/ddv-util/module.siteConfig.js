export default moduleSite

function moduleSite (ddvUtil, { app, store, res, req, redirect, route, isDev }, inject) {
  return Promise.resolve()
  var acceptLanguage = getAcceptLanguage(req && req.headers) || ''
  return ddvUtil.get('v1.0/api/web/site/config')
    .headers({
      'x-ddv-from-lang': acceptLanguage
    })
    .sendValidData({
      localeLanguage: route.query.language ||
        ddvUtil.cookie('locale-language') ||
        store.state.locale ||
        void 0
    })
    .then(({ data }) => {
      let locale = data.acceptLocale || data.fallbackLocale

      for (let i = 0; i < data.languageLists.length; i++) {
        if (data.languageLists[i].code === locale) {
          store.commit('setLanguageId', data.languageLists[i].languageId)
          break
        }
      }
      ddvUtil.cookie('locale-language', locale)
      // 当前选择的语言
      store.commit('setLocales', Object.keys(data.locales))
      store.commit('setLocalesMessages', data.locales)
      store.commit('setLang', locale)
      store.commit('setFallbackLocale', data.fallbackLocale)
      // 设置语言列表
      store.commit('setLanguageLists', data.languageLists)
      store.commit('setPaymentLogo', data.paymentLogo)
      store.commit('setSiteLogo', data.siteLogo)
      store.commit('setSiteDomain', data.domain)
      store.commit('setSiteTitle', data.seoTitle)
      store.commit('setprojectId', data.projectId)
      store.commit('setSiteKeywords', data.seoKeywords)
      store.commit('setSiteDescription', data.seoDescription)
      store.commit('setPaymentVerification', data.paymentVerification)
      store.commit('setIcpBeian', data.icpBeian)

      store.commit('setSeoLogo', data.seoTitle)
      store.commit('setSeo', {
        title: data.seoTitle,
        desc: data.seoDescription,
        imgUrl: data.seoThumb,
        link: ddvUtil.getOrigin() || ''
      })
      return data
    })
    .then(({
      serverPort,
      isSsl,
      domain
    }) => {
      // 开发模式 或 授权 或 扫码
      if (isDev || route.path === '/login/sweepcode' || route.name === 'oauth-appName-appType') {
        return Promise.resolve()
      }
      var fullUri, fullUriNew, fullUriObj
      if (domain && typeof isSsl === 'boolean' && (ddvUtil.isHttps() !== isSsl || ddvUtil.getHost() !== domain)) {
        fullUri = ddvUtil.getFullUri()
        fullUriObj = Object.assign(ddvUtil.api.url.parse(fullUri), {
          host: domain,
          scheme: isSsl ? 'https' : 'http',
          port: serverPort || void 0
        })
        fullUriNew = ddvUtil.api.url.build(fullUriObj)
        fullUri = fullUriObj = void 0
        return ddvUtil.redirect(fullUriNew)
      }
      return Promise.resolve()
    })
}

function getAcceptLanguage (headers) {
  var res
  if (process.browser) {
    if (navigator) {
      res = navigator.languages || navigator.userLanguage || navigator.systemLanguage || navigator.language
    }
    res = Array.isArray(res) ? res.join(',') : res
  } else {
    res = headers && headers['accept-language']
  }
  return res
}
