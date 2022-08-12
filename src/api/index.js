// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request'  // 引入自定义axios函数

// 导出接口方法，为了在逻辑页面引入后调用
export const registerAPI = ({ username, password, repassword }) => {
    // 原地是一个Promise对象(内部包含原生ajax请求)
    // return这个Promise对象到逻辑页面，去那边对Promise对象提取结果
    return request({
        url: '/api/reg',
        method: 'POST',
        // axios传参params，data
        // params的对象参数名和值，axios源码会把参数和值，拼接在url?后面给后台(query查询字符串)
        // data的对象参数名和值，axios源码会把参数和值，拼接在请求头里(body参数)
        data: {
            // username: username,
            username,
            password,
            repassword
        }
    })
}

// 登录接口
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}