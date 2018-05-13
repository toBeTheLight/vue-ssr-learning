## 基本原理

服务端接收到请求后进行页面的渲染，针对每个请求生成新的 vue 实例，使用**虚拟 dom**，进行 HTML 字符串的生成并返回。

## 服务器端代码注意事项

1. 在服务端只有创建vue实例的阶段，也就是说只会调用 beforeCreate 和 created 声明周期钩子。
2. dom 操作等浏览器端独有api，在其他声明周期中使用，无法避免的 dom 操作相关的自定义指令，可以提供服务器端版本。
3. 数据预读取。

## 数据预取
* 好像是将组件的数据获取逻辑从各个部分统一改为了放在相同的 api 中。
* 在组件的 asyncData api（自定名） 中写数据预取的逻辑，无法使用this。
```js
asyncData ({ store, route }) {
  // 触发 action 后，会返回 Promise
  return store.dispatch('fetchItem', route.params.id)
}
```

* 在服务端入口文件中，获取当前路由匹配组件，调用它们的 asyncData 方法。
```js
// 对所有匹配的路由组件调用 `asyncData()`
Promise.all(matchedComponents.map(Component => {
  if (Component.asyncData) {
    return Component.asyncData({
      store,
      route: router.currentRoute
    })
  }
})).then(() => {
  // 在所有预取钩子(preFetch hook) resolve 后，
  // 我们的 store 现在已经填充入渲染应用程序所需的状态。
  // 当我们将状态附加到上下文，
  // 并且 `template` 选项用于 renderer 时，
  // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
  context.state = store.state
```

* 在客户端入口文件中，将服务器预取数据加载到 store.
```js
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

* 在客户端入口文件中，设置预设数据的调用与路由跳转的逻辑

```js 
// 路由参数更新时
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
```
```
// 一般路由跳转
/**
 *  方式1
 *  在进入路由前，进行路由组件对比，执行 asyncData，获取数据后跳转
 *  
 *  方式2
 *  先进入路由，在每个组件的生命周期中调用获取数据更新
 */

```