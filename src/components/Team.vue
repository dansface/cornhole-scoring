<template>
  <div class=".team">
    <h3>
      {{ name }}
    </h3>
    <div class=".btn-container">
      <!-- FUTURE How can I dynamically get value instead of hard coding here? -->
      <Button @btn-click="$emit('btn-click', 1, this.name)" text="+1" :value=1 />
      <Button @btn-click="$emit('btn-click', 3, this.name)" text="+3" :value=3 />
      <Button @btn-click="$emit('btn-click', -1, this.name)" text="-1" :value=-1 />
      <Button @btn-click="$emit('btn-click', -3, this.name)" text="-3" :value=-3 />
    </div>
  </div>
</template>

<script>
import Button from './Button';
export default {
    name: "Team",
    props: {
        name: String,
        score: Number,
    },
    components: { Button }
}
</script>

<style scope>

.team {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

/* TODO change this so it's a 2x2 grid */
.btn-container button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
