const path = require('path')
module.exports = {
  outputDir: 'dist',
  devServer: {
    disableHostCheck: true,
    // proxy:{
    //   '/socket.io':{
    //     target:'//localhost:8082',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {

    //     }
    //   }
    // }
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
