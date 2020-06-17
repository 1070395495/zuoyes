import Vue from 'vue'
import VueRouter from 'vue-router'

// const Home = ()=>import("../views/Home.vue")
const Index = () => import("../views/index.vue")
const Login = () => import("../views/login.vue")
const List = () => import("../views/list.vue")
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {//设置路由元数据
      Authorition: true
    },
    children: [
      { path: '', component: List }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})
  // 全局路由守卫
router.beforeEach((to, from, next) => {
  console.log('to:', to)
  const token = localStorage.getItem('token');
  if (to.meta.Authorition) {
    if (token) {
      next()
    } else {
      router.push("/login")
    }
  } else {
    next()
  }

})
export default router
