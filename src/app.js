// 创建 vue 根实例
import Vue from 'vue'
import { createRouter } from './router'
import { createStore } from './store'

import { sync } from 'vuex-router-sync'

import App from './App.vue'

export function createApp () {
  // 创建 router
  const router = createRouter()
  const store = createStore()
  // 这一步会将 router 的状态和参数存在 state.route 上
  sync(store, router)
  const app = new Vue({
    data: {
      name: 'demo'
    },
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    router,
    store
  }
}
