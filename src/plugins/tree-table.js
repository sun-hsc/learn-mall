import Vue from 'vue'
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 全局注册组件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
