const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/assets/styles/scss/_global.scss";`
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production'? '/mappapp/' : '/',
    chainWebpack: config => {
        config.plugin('html')
          .tap(args => {
            args[0].minify = false
            return args
          })
      }
})
