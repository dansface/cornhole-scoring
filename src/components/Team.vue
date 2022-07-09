<template>
  <div class="team">
    <div class="team-name">
      {{ name }}
    </div>
    <div class="btn-container">
      <!-- FUTURE How can I dynamically get value instead of hard coding here? -->
      <Button class="increment" @btn-click="$emit('btn-click', 1, this.name)" text="+1" :value=1 />
      <Button class="increment" @btn-click="$emit('btn-click', 3, this.name)" text="+3" :value=3 />
      <Button class="decrement" @btn-click="$emit('btn-click', -1, this.name)" text="-1" :value=-1 />
      <Button class="decrement" @btn-click="$emit('btn-click', -3, this.name)" text="-3" :value=-3 />
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
  background: #a6a1a1;
  margin: 5px;
  padding: 25px 20px;
  cursor: pointer;
}

.btn-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 100%;
  padding-bottom: 40px;
}

.increment {
  color: white;
  background-color: green;
}

.decrement {
  color: white;
  background-color: red;
}
</style>
