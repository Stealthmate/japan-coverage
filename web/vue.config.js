module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.module
      .rule('html')
      .test(/\.svg$/)
      .use('html-loader')
      .loader('html-loader')
  }
}
