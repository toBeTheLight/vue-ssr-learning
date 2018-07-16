<template>
  <div>
    <Child @complete="complete"/>
    <Child2 :result="result"/>
  </div>
</template>

<script>
import Child from './Child.vue'
import Child2 from './Child2.vue'
export default {
  name: 'test',
  asyncData ({store, router}) {
    console.log('将会发送请求')
  },
  data () {
    return {
      result: 123
    }
  },
  methods: {
    complete () {
      console.log('子组件生成完毕，修改父组件的data')
      this.result = 'complete'
    },
  },
  created () {
    console.log('fa: created')
  },
  beforeMount () {
    console.log('fa: beforeMounted')
  },
  mounted () {
    console.log('fa: mounted')
  },
  components: {
    Child,
    Child2
  }
}
</script>

<style>

</style>
