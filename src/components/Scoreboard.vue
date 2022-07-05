<template>
  <div class=".scoreboard">
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
export default {
  name: 'Scoreboard',
  props: {
    teamAName: String,
    teamBName: String,
  },
  data() {
    return {
      teamAScore: 0,
      teamBScore: 0,
    }
  }
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
