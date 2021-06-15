import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//elemnet组件
import './plugins/element'

import 'font-awesome/css/font-awesome.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// prototype 通过原型挂vue上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
