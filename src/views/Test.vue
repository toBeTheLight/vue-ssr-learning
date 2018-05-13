<template>
  <div>
    <h1>test</h1>
    <ul>
      <li v-for="val in items" :key="val">{{val}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  asyncData ({store, router}) {
    console.log('将会发送请求')
    return store.dispatch('fetchItem', 123)
  },
  computed: {
    items () {
      return this.$store.state.items[123]
    }
  }
}
</script>

<style>

</style>
