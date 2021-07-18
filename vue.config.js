const path = require('path') // 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) // path.join(_dirname)设置绝对路径
}

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      // 第一个参数：别名 第二个参数：路径
      .set('@', resolve('src'))
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
      .set('common', resolve('src/common'))
      .set('views', resolve('src/views'))
      .set('plugins', resolve('src/plugins'))

    /**
     * process.env.NODE_ENV  获取到项目打包或者运行时的命令
     * 通过判断其是开发环境还是发布来决定是否启用  'transform-remove-console'
     * 以此来做到开发调试时保留console，发布时去掉
     */

    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      //   .entry('app').clear().add('./src/main-prod.js')
      //  清空打包路径入口，追加自定义打包路径入口

      // 配置需要通过cdn外部引用的资源减小项目体积，但是要在html中添加cdn相应的css和js连接引用
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 设置首页的值，让首页判断是那个模式
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      //   .entry('app').clear().add('./src/main-dev.js')
      //  清空serve开发路径入口，追加自定义开发路径入口

      // 设置首页的值，让首页判断是那个模式
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
