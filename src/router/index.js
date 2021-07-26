import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue'
  )

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue'
  )
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () =>
  import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const GoodsList = () =>
  import(/* webpackChunkName: "goodslist_add" */ '../components/goods/List.vue')
const Add = () =>
  import(/* webpackChunkName: "goodslist_add" */ '../components/goods/Add.vue')
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Order = () =>
  import(/* webpackChunkName: "order_reprot" */ '../components/order/Order.vue')
const Report = () =>
  import(
    /* webpackChunkName: "order_reprot" */ '../components/report/Report.vue'
  )

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
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
