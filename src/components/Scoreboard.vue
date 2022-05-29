<template>
  <div class=".scoreboard">
    <p>Score:</p>
    <p>
        {{ teamA.name }} : {{teamA.score}}
    </p>
    <p>
        {{ teamB.name }} : {{teamB.score}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Scoreboard',
  props: {
    teamA: Object,
    teamB: Object,
  },
}
</script>

<style scope>
/* TODO update styles */
.scoreboard {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
