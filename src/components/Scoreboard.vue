<template>
  <div class="scoreboard">
    <p>Scoreboard</p>
    <p>
        {{ teamAName }} : {{ teamAScore }}
    </p>
    <p>
        {{ teamBName }} : {{ teamBScore }}
    </p>
  </div>
</template>

<script>
// FUTURE This whole component really should be a watcher and read values from Team.vue
export default {
  name: 'Scoreboard',
  props: {
    teamAName: String,
    teamBName: String,
    teamAScore: Number,
    teamBScore: Number,
  },
}
</script>

<style scope>

.scoreboard {
  background: #d4cecd;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
