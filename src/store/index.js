import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
    userInfo: {} // 保存用户信息对象
  },
  getters: {
    // 非简写
    // username (state) {
    // return state.userInfo.username
    // }
    // 简写
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  actions: {
    // 请求 用户信息
    async getUserInfoActions(store) {
      const { data: res } = await getUserInfoAPI()
      store.commit('updateUserInfo', res.data)
    }
  },
  mutations: {
    // 保存token
    updateToken(state, value) {
      state.token = value
    },
    // 保存用户的信息
    updateUserInfo(state, info) {
      state.userInfo = info
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState()  // 注入持久化插件
  ]
})

// vuex默认保存在内存中，所以刷新所有的值会回归初始化(无法做到持久存储)
// 借助插件可以让vuex做持久化存储
