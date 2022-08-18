import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

export const baseURL = 'http://big-event-vue-api-t.itheima.net' // 接口和图片资源所在的服务器地址

// 创建一个自定的axios方法(比原axios多了一个基地址)
// axios函数请求的url地址前面会被拼接基地址，然后axios请求baseURL+url后台完整地址
const myAxios = axios.create({
    // baseURL: 'http://big-event-vue-api-t.itheima.net'
    baseURL
})

// 定义请求拦截器
// api里每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(function (config) {
    // config配置对象(要请求后台的参数都在这个对象上)
    // 在请求前会触发一次
    // 它返回给axios内源码，config配置对象（要请求后台的参数都在这个对象上）

    // 在发起时，统一携带请求头Authorization和token值
    // 判断，登录页面和注册页面，vuex里无token，而且登录接口和注册接口也不需要携带token(其他页面需要)
    if (store.state.token) {
        config.headers.Authorization = store.state.token
    }

    return config
}, function (error) {
    // 请求发起前的代码，如果有异常报错，会直接进入这里
    // 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
    // 此函数类似catch函数()里return
    // 口诀：return非Promise对象值，会作为成功的结果，返回给下一个Promise对象(axios留在原地)
    // Promise.reject() 原地留下一个新的Promise对象(状态为失败) 他是Promise的类方法reject()
    return Promise.reject(error)
    // 等同于
    // return new Promise((resolve,reject) => {
    //     reject(error)
    // })
}
)

// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 响应http状态码为 2xx或3xx 时触发成功的回调，形参中的 response 是“成功的结果”
    // return到axios原地的Promise对象，作为成功的结果
    return response
}, function (error) {
    // 响应状态码为 4xx 5xx 时触发失败的回调，形参中的 error 是“失败的结果”
    // return到axios原地Promise对象位置，作为失败拒绝的状态(如果那边用try+catch或者catch函数捕获，可以捕获到我们传递过去的这个error变量的值)

    if (error.response.status === 401) {
        // 本次响应是token过期了
        // 清除vuex里的一切，然后切换回到登录页面(被动退出登录状态)
        store.commit('updateToken', '')
        store.commit('updateUserInfo', {})
        router.push('/login')
        Message.error('用户身份已过期')
    }
    return Promise.reject(error)
})

// 导出自定义的axios方法，供外面调用传参发请求
export default myAxios 