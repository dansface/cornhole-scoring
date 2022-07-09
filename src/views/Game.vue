<template>
  <!-- <router-link to="/">Go Back</router-link> -->
  <Scoreboard
    :teamAName="teamAName"
    :teamBName="teamBName"
    :teamAScore="teamAScore"
    :teamBScore="teamBScore"
  />
  <Team
    @btn-click="btnClick"
    :name="teamAName"
    :score=0
  />
  <Team
    @btn-click="btnClick"
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
      teamAScore: 0,
      teamBScore: 0,
    }
  },
  methods: {
    btnClick(value, name) {
      if (name === this.teamAName) {
        this.teamAScore += value;
        if (this.teamAScore < 0) {
          this.teamAScore = 0;
        }
      } else if (name === this.teamBName) {
        this.teamBScore += value;
        if (this.teamBScore < 0) {
          this.teamBScore = 0;
        }
      }
    },
  },
};
</script>
