<template>
  <div>
    <h1>test</h1>
    <input type="text">
    <button @click="set">设置数组</button>
  </div>
</template>

<script>
export default {
  asyncData ({store, router}) {
    console.log('将会发送请求')
    return store.dispatch('fetchItem', 123)
  },
  watch: {
    items: {
      handler (newVal, oldVal) {
        console.log(newVal === oldVal)
      },
      immediate: true
    } 
  },
  methods: {
    set () {
      this.$store.dispatch('fetchItem', 123)
    }
  },
  computed: {
    items () {
      return this.$store.state.items
    }
  }
}
</script>

<style>

</style>
