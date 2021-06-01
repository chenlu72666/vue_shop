import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫,只有登录过才能访问homeyemian
router.beforeEach((to, from, next) => {
  // to要访问的路径
  // from从哪个路径跳转来的
  // next是一个函数,表示放行
  // next()放行,next("路径")表示强制跳转的路径
  if (to.path === '/login') return next()
  if (!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
