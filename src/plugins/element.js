import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import { Form, FormItem, Input, Button } from 'element-ui'
//需要全局挂载
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
