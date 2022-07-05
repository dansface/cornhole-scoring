<template>
  <!-- <router-link to="/">Go Back</router-link> -->
  <Scoreboard
    :teamAName="teamAName"
    :teamBName="teamBName"
  />
  <Team
    :name="teamAName"
    :score=0
  />
  <Team
    :name="teamBName"
    :score=0
  />
</template>

<script>
import Team from '../components/Team'
import Scoreboard from '../components/Scoreboard'
export default {
  name: 'Game',
  props: {
    teamAName: String,
    teamBName: String,
  },
  components: {
    Scoreboard,
    Team,
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
