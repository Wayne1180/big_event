// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request'  // 引入自定义axios函数
import store from '@/store'  // 引入store对象

// 导出接口方法，为了在逻辑页面引入后调用
// 注册接口
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

// 获取用户数据的接口
export const getUserInfoAPI = () => {
    return request({
        url: '/my/userinfo',
        method: 'GET',
        // 传参给后台：params(查询字符串query)，data(请求体body),headers(请求头)
        // headers: {
        //     // this.$store.state.token 这里this不是组件对象不能用this.$store拿到store对象
        //     Authorization: store.state.token
        // }

    })
}

// 获取侧边栏数据
export const getMenusListAPI = () => {
    return request({
        url: '/my/menus',
    })
}

// 更新用户基本资料
export const updateUserInfoAPI = (obj) => {
    return request({
        url: '/my/userinfo',
        method: 'PUT',
        data: obj

        // id,
        // email,
        // nickname,
        // user_pic,
        // username

    })
}
// export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
//     return request({
//         url: '/my/userinfo',
//         method: 'PUT',
//         data: {
//             id,
//             email,
//             nickname,
//             user_pic,
//             username
//         }
//     })
// }

// 更新用户头像
// 只有一个参数，不需要解构赋值
export const updateUserAvatarAPI = (avatar) => {
    return request({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
            avatar // 头像base64字符串
        }
    })
}

// 更新用户密码
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
    return request({
        url: '/my/updatepwd',
        method: 'PATCH',
        data: {
            old_pwd,
            new_pwd,
            re_pwd
        }
    })
}

// 获取文章分类
export const getArtCateListAPI = () => {
    return request({
        url: '/my/cate/list'
    })
}

// 增加文章分类
export const addArtCateListAPI = ({ cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/add',
        method: 'POST',
        data: {
            cate_name,
            cate_alias
        }
    })
}

// 更新文章分类
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/info',
        method: 'PUT',
        data: {
            id,
            cate_name,
            cate_alias
        }
    })
}

// 删除文章分类
export const deleteArtCateAPI = (id) => {
    return request({
        url: '/my/cate/del',
        method: 'DELETE',
        params: {
            id
        }
    })
}

// 发布文章 参数是FormData表单数据对象
export const uploadArticleAPI = (fd) => {
    return request({
        url: '/my/article/add',
        method: 'POST',
        data: fd
        // {} 如果是一个普通对象，axios会把它转成JSON字符串在请求体里交给后台
        // 这个接口文档要求请求体里是一个FormData类型（表单数据对象）携带文件给后台
    })
}


// 获取文章列表
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
    return request({
        // query参数第一种写法
        // url:`/my/article/list?pagenum=${}`,

        // query参数第二种写法,axios拼
        url: '/my/article/list',
        params: {
            pagenum, // 当前页码
            pagesize, // 当前页需要的数据条数
            cate_id, // 文章分类id
            state // 文章状态
        }

    })
}

// 获取文章详情
export const getArtDetailAPI = (id) => {
    return request({
        url: '/my/article/info',
        params: {
            id
        }
    })
}

// 删除文章
export const delArticleAPI = (id) => {
    return request({
        url: '/my/article/info',
        method: 'DELETE',
        params: {
            id
        }
    })
}