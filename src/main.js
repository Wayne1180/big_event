import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index' // 让elementUI注册的代码参与打包，才能在页面上运行并注册组件
import '@/QuillEditor/index'

import dayjs from 'dayjs'
// 基于dayjs封装一个全局函数来格式化时间(任意的组件可以直接使用$formatDate)
Vue.prototype.$formatDate = (dataObj) => {
  // 借助dayjs内置的方法把日期对象格式化成指定的格式，并把格式化好的字符串返回到调用处
  return dayjs(dataObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
