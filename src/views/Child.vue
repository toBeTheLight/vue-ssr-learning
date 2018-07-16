<template>
  <div>child</div>
</template>

<script>
export default {
  name: 'child',
  created () {
    console.log('child: child')
    this.$emit('complete')
    console.log(123)
  },
  beforeMount () {
    console.log('child: before')
  },
  mounted () {
    console.log('child: mounted')
  }
}
</script>

<style>

</style>
