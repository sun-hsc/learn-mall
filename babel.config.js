// 项目开发阶段用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
/**
 * process.env.NODE_ENV  获取到项目打包或者运行时的命令
 * 通过判断其是开发环境还是发布来决定是否启用  'transform-remove-console'
 * 以此来做到开发调试时保留console，发布时去掉
 */
module.exports = {
  // presets: ['@vue/cli-plugin-babel/preset'],

  presets: ['@vue/app'],
  plugins: [
    // element官方教程
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],

    // 发布产品时候的插件数组
    //  ... 数组展开
    ...prodPlugins
  ]
}
