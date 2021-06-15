import axios from 'axios'
import originAxios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

Vue.prototype.$http = axios
