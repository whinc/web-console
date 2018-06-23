const path = require('path') 

module.exports = {
  css: { extract: false },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
      config.output.publicPath = './'
    } else {
      // mutate for development...
    }
    config.resolve.alias = {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
