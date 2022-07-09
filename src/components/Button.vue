<template>
  <button @click="onClick" class="btn">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: String,
    value: Number,
  },
  methods: {
    onClick() {
      this.$emit('btn-click', this.value)
    },
  },
}
</script>

<style scoped>
  button{
    margin: 3px
  }
</style>
