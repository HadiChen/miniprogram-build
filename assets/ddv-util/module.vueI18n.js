import VueI18n from 'vue-i18n'
export default moduleLanguage

function moduleLanguage (ddvUtil, {app, store}, inject) {
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: store.state.fallbackLocale,
    messages: store.state.localesMessages
  })
}
