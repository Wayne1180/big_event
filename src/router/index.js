import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 默认打开直接看到布局页
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由
    children: [
      // 侧边栏导航，点击会切换路由地址，路由地址靠数据请求回来铺设上去的
      // 所以你的路由规则要配合它保持一致
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd')
      },
      {
        path: '/art-cate', // 文章分类
        component: () => import('@/views/article/artCate')
      },
      {
        path: '/art-list', // 文章列表
        component: () => import('@/views/article/artList')
      }
    ]
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
  },


]

const router = new VueRouter({
  routes
})

let whiteList = ['/login', '/reg'] // 白名单 无需登录可以访问的路由地址

// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫函数
// 有token就证明登陆了，无token未登录
// 当路由跳转时获取用户信息
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 已经登陆了
    if (!store.state.userInfo.username) {
      // 你现在本地有token值，才去请求用户信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组.includes(值) 作用：判断值是否在数组里面出现过，出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址,则放行(路由全局前置守卫不会再次触发了，而是匹配路由表，让组件挂载)
      next()
    } else {
      // next()强制切换到登录路径上
      next('/login')
    }
  }
})

export default router
