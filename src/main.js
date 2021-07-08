import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elemnet组件
import './plugins/element'
// 树形表格组件
import './plugins/tree-table'
// 第三方字体
import 'font-awesome/css/font-awesome.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// prototype 通过原型挂vue上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
