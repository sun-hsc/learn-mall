import Vue from 'vue'
import Moment from 'moment'

// 定义全局时间戳过滤器
Vue.filter('formatDate', function(value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})
// 自定义时间过滤器
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)
  // padStart() 从当前字符串的开始(左侧) 位置填充。
  // padEnd() 从当前字符串的末尾（右侧）开始填充。
  //  有两个参数，一个为长度(补充后的长度)，第二个为补充的字符
  // 超出的长度不会补充后续的字符
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 价格展示过滤
Vue.filter('showPrice', price => {
  // 过滤器，保留小数点输出
  return '￥' + price.toFixed(1)
})
