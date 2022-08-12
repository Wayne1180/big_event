import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/reg',
    component: () => import(/* webpackChunkName:"register" */ '@/views/register')
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName:"login" */ '@/views/login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName:"login" */ '@/views/layout')
  }
]

const router = new VueRouter({
  routes
})

export default router
