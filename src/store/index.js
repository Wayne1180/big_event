import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '' // 保存token字符串
  },
  getters: {
  },
  actions: {
  },
  mutations: {
    // 保存token
    updateToken(state, value) {
      state.token = value
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
