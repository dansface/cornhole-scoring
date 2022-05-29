<template>
  <h3>Version 1.0.0</h3>
  <!-- <router-link to="/">Go Back</router-link> -->
  <p>Game View</p>
  <!-- <Scoreboard
    teamA=""
    teamB=""
  />
  <Team
    name="Team A"
    score="0"
  />
  <Team
    name="Team B"
    score="0"
  /> -->
</template>

<script>
import Team from '../components/Team'
import Scoreboard from '../components/Scoreboard'
export default {
  name: 'Game',
  props: {

  },
  components: {
    Team,
    Scoreboard,
  },
  data() {
    return {
      //whatever you want
    }
  },
  methods: {
    add(team, amount) {
        team.score += amount;
    },
    subtract(team, amount) {
        team.score -= amount;
    },
  },
  
};
</script>
