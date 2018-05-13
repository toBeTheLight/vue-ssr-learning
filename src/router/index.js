// router.js
import Vue from 'vue'
import Router from 'vue-router'
const Demo = () => import('../views/Demo.vue')
const Test = () => import('../views/Test.vue')

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/test',
      component: Test
    },
    {
      path: '/demo',
      component: Demo
    }
    ]
  })
}