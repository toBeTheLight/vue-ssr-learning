<template>
  <div>test</div>
</template>

<script>
export default {
 asyncData ({store, router}) {
   return store.dispatch('fetchItem', { id: 123 })
 }
}
</script>

<style>

</style>
