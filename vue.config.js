module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  devServer: {
    port: 8080,
  },
  // サブドメイン時のためのパラメータです。
  // ./ にすると assets は解決する。だけど spa が解決しなかった。
  // TODO: カスタムドメインでの運用が始まったら消すこと。
  publicPath: '/ShuumulatorWeb/'
}
