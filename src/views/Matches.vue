<template>

  <v-container>
    <v-tabs fixed-tabs>
      <v-tab
        v-for="n in 3"
        :key="n"
      >
        Item {{ n }}
      </v-tab>
    </v-tabs>
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
      id="scrollContainer"
      column
      v-for="matchDay in sortedMatchDaysDisplayed"
      :key="matchDay.id"
    >
      <v-flex>
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
          :class="{'scroll_target': isTodayMatch(match)}"
        >
          <MatchCard
            :indvMatch="match"
            :cardTeams="getTeamsFromMatch(match)"
          />
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

  components: {
    MatchCard
  },
  props: ["id_competition"],
  data() {
    return {
      offsetTop: 10,
      loading: false,
      lastScrollHeight: 0,
      lastBottomHeight: 0,
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
    this.matchDaysDisplayed.push(this.currentMatchDay);
  },

  mounted() {
    console.log("Inject scroll listener");
    this.onScroll();
    this.$vuetify.goTo(".scroll_target", this.options);
  },

  beforeDestroy() {
    //destroy windows scroll listener
    console.log("Destroy scroll listener");
    window.onscroll = null;
  },

  computed: {
    ...mapState(["league_competition", "league_matches", "league_teams"]),

    lastMatchDay() {
      var len = this.league_matches.matches.length;
      return this.league_matches.matches[len - 1].matchday;
    },
    currentLeagueInfo() {
      return this.league_competition.competitions.find(
        obj => obj.id == this.id_competition
      );
    },
    currentMatchDay() {
      return this.currentLeagueInfo.currentSeason.currentMatchday;
    },
    sortedMatchDaysDisplayed() {
      return this.matchDaysDisplayed.sort((a, b) => a - b);
    }
  },

  methods: {
    onScroll() {
      window.onscroll = () => {
        if (document.documentElement.scrollTop === 0) {
          this.lastScrollHeight = document.documentElement.scrollHeight;
          this.addPrevMatchDay();
        }
        if (
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight
        ) {
          this.lastBottomHeight =
            document.documentElement.scrollTop + window.innerHeight;
          this.addNextMatchDay();
        }
      };
    },
    getTeamsFromMatch(_match) {
      var _homeTeam = this.league_teams.teams.find(
        obj => obj.id === _match.homeTeam.id
      );
      var _awayTeam = this.league_teams.teams.find(
        obj => obj.id === _match.awayTeam.id
      );
      return { homeTeam: _homeTeam, awayTeam: _awayTeam };
    },
    addNextMatchDay() {
      this.loading = true;
      console.log("Adding Next matches...");

      let arr = this.matchDaysDisplayed;
      let len = this.matchDaysDisplayed.length;
      let value = arr[len - 1] + 1;
      //We got the end of the matchDay current list
      if (value > this.lastMatchDay) return;
      //Check for duplicates
      if (arr.includes(value) === false) this.matchDaysDisplayed.push(value);

      this.loading = false;
    },
    addPrevMatchDay() {
      this.loading = true;

      console.log("Adding Previous matches...");
      //We got the start of the matchDay current list
      let arr = this.matchDaysDisplayed;
      let value = arr[0] - 1;
      if (value < 1) return;
      //Check for duplicates
      if (arr.includes(value) === false) this.matchDaysDisplayed.unshift(value);

      this.loading = false;
    },

    matchesInMatchDay(m_day) {
      return this.league_matches.matches.filter(obj => obj.matchday === m_day);
    },
    isTodayMatch(match) {
      var date = match.utcDate;
      var today = new Date().toISOString();
      if (today < date) return true;
      return false;
    },
    getYearFromDate(strDate) {
      var d = new Date(strDate);
      return d.getFullYear();
    },
    currentSeasonYears(startD, endD) {
      return this.getYearFromDate(startD) + "-" + this.getYearFromDate(endD);
    }
  },
  watch: {
    matchDaysDisplayed() {
      if (this.lastBottomHeight <= this.lastScrollHeight)
        document.documentElement.scrollTop +=
          document.documentElement.scrollHeight - this.lastScrollHeight;
    }
  }
};
</script>
