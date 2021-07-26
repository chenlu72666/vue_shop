import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入父文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入父文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入树形结构表
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'
// 导入进度条JS
import Nprogress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
import axios from 'axios'
// 配置axios的默认请求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start()
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
// 挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 将父文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function(date) {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = (dt.getDate()).toString().padStart(2, '0')
  const hh = (dt.getHours()).toString().padStart(2, '0')
  const mm = (dt.getMinutes()).toString().padStart(2, '0')
  const ss = (dt.getSeconds()).toString().padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
