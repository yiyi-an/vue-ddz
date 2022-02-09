const path = require('path')
module.exports = {
  outputDir: 'dist',
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: (config) => {
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        // 别名配置
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components')
        }
      }
    })
  },
  lintOnSave: false
}
