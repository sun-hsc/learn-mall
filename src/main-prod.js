import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elemnet组件
// import './plugins/element'
// 第三方字体
import 'font-awesome/css/font-awesome.css'
// 过滤器
import './plugins/other/filter'

// 树形表格
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'

// 导入NProgress, 包对应的JS和CSS
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

import axios from 'axios'

import VueRouter from 'vue-router' // 调用编辑器
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 全局注册组件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config => {
  // 在request 拦截器中, 展示进度条 NProgress.start()
  NProgress.start()
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// prototype 通过原型挂vue上
Vue.prototype.$http = axios
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
