<template>
  <v-container>

    <v-layout
      align-center
      justify-center
      column
      fill-height
    >
      <h1 class="headlines"> {{currentSeasonYears(currentLeagueInfo.currentSeason.startDate,currentLeagueInfo.currentSeason.endDate)}} Season</h1>
      <h2 class="subheading"> Matchday {{currentMatchDay}}</h2>
    </v-layout>

    <v-layout
      column
      v-for="m_day in lastMatchDay"
      :key="m_day"
    >
      <v-flex :class="{'scroll_target': isTodayMatchDay(m_day)}">
        <v-subheader class="title py-3">Matchday {{m_day}} of {{lastMatchDay}}</v-subheader>
      </v-flex>

      <v-layout
        wrap
        justify-center
      >
        <v-flex
          sm6
          xs12
          class="py-1"
          v-for="match in matchesInMatchDay(m_day)"
          :key="match.id"
        >
          <MatchCard :indvMatch="match" />
        </v-flex>
      </v-layout>
    </v-layout>

  </v-container>
</template>

<script>
import MatchCard from "../components/MatchCard.vue";
import { mapState } from "vuex";

export default {
  name: "Matches",
  components: { MatchCard },
  props: ["id"],
  data() {
    return {
      matchDaysDisplayed: [],
      options: {
        duration: 0,
        offset: -50,
        easing: "easeInOutCubic"
      }
    };
  },
  mounted() {
    console.log(this.currentMatchDay);
    //scrool to current matchday
    this.$vuetify.goTo(".scroll_target", this.options);
  },
  computed: {
    ...mapState(["league_competition", "league_matches"]),
    currentArrayOfMatches() {
      var displayedMdArrays = [this.currentMatchDay];
      return this.league_matches.matches.filter(obj => obj.matchday);
    },
    lastMatchDay() {
      var len = this.league_matches.matches.length;
      return this.league_matches.matches[len - 1].matchday;
    },
    currentLeagueInfo() {
      return this.league_competition.competitions.find(
        obj => obj.id == this.id
      );
    },
    currentMatchDay() {
      return this.currentLeagueInfo.currentSeason.currentMatchday;
    }
  },

  methods: {
    matchesInMatchDay(m_day) {
      return this.league_matches.matches.filter(obj => obj.matchday === m_day);
    },
    isTodayMatchDay(m_day) {
      return m_day === this.currentMatchDay;
    },
    getYearFromDate(strDate) {
      var d = new Date(strDate);
      return d.getFullYear();
    },
    currentSeasonYears(startD, endD) {
      return this.getYearFromDate(startD) + "-" + this.getYearFromDate(endD);
    }
  }
};
</script>
