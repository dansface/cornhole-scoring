<template>
  <button @click="onClick()" class="btn">
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
      this.$emit('btn-click')
    },
  },
}
</script>
