import { createApp } from './app'
import Vue from 'vue'

// 客户端特定引导逻辑……

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
// 路由重用参数更改更新
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

router.onReady(() => {
  // 路由跳转数据更新
  router.beforeResolve((to, from, next) => {
    // 获取跳转前后组件列表
    const componentsMatched = router.getMatchedComponents(to)
    const componentsPrevMatched = router.getMatchedComponents(from)
    let diffed = false
    // 对比得出欲更新数据组件
    const activated = componentsMatched.filter((c, i) => {
      return diffed || (diffed = (componentsPrevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    }))
    .then(() => {
      next()
    })
    .catch(next)
  })
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})