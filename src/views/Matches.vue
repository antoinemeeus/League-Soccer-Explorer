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
      v-for="matchDay in matchDaysDisplayed"
      :key="matchDay.id"
    >
      <v-flex :class="{'scroll_target': matchDay===currentMatchDay}">
        <v-subheader class="title py-3">Matchday {{matchDay}} of {{lastMatchDay}}</v-subheader>
      </v-flex>

      <v-layout
        wrap
        justify-center
      >
        <v-flex
          sm6
          xs12
          class="py-1"
          v-for="match in matchesInMatchDay(matchDay)"
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
  beforeMount() {
    console.log(this.currentMatchDay);
    //push currentMatchDay to array of displayedmatches
    this.matchDaysDisplayed.push(this.currentMatchDay);
    this.matchDaysDisplayed.push(this.currentMatchDay - 1);
    this.matchDaysDisplayed.push(this.currentMatchDay + 1);
    this.matchDaysDisplayed.push(this.currentMatchDay + 2);
    //scrool to current matchday
    this.$vuetify.goTo(".scroll_target", this.options);
  },
  computed: {
    ...mapState(["league_competition", "league_matches"]),
    currentArrayOfMatches() {
      return this.league_matches.matches.filter(obj =>
        this.matchDaysDisplayed.includes(obj.matchday)
      );
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
