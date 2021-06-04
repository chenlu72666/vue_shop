import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params }
    ]
  }
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
