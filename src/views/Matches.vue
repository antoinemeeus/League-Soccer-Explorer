<template>

  <v-container fluid>
    <v-layout
      justify-center
      pb-2
    >
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-layout>
    <v-layout
      column
      v-for="matchDay in sortedMatchDaysDisplayed"
      :key="matchDay"
    >

      <v-flex>
        <h2 class="title py-3">Matchday {{matchDay}} of {{lastMatchDay}}</h2>
      </v-flex>

      <v-layout
        wrap
        justify-center
      >
        <v-flex
          sm6
          xs12
          class="py-1"
          v-for="match in getMatchesInMatchDay(matchDay)"
          :key="match.id"
          :class="{'scroll_target current-match-card': match.id===nextMatch.id}"
        >

          <MatchCard
            :iscurrentMatch="match.id===nextMatch.id"
            :indvMatch="match"
            :cardTeams="getTeamsFromMatch(match)"
          />
        </v-flex>
      </v-layout>

    </v-layout>
    <v-layout
      justify-center
      pt-2
    >
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
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
      offsetTop: 50,
      lastScrollHeight: 0,
      lastBottomHeight: 0,
      matchDaysDisplayed: [],
      options: {
        duration: 0,
        offset: -300, //-(document.documentElement.clientHeight / 2),
        easing: "easeInOutCubic"
      }
    };
  },
  beforeMount() {
    //We add current and previous matchday to list
    this.matchDaysDisplayed.push(this.currentMatchDay);
    this.currentMatchDay - 1 >= 0
      ? this.matchDaysDisplayed.push(this.currentMatchDay - 1)
      : null;
  },

  mounted() {
    //Jump to current or nextMatch
    let self = this;
    setTimeout(function() {
      self.$vuetify.goTo(".scroll_target", self.options);
    }, 500);
    console.log("Inject scroll listener");
    this.onScroll();
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
    nextMatch() {
      //Find current or next match by obtaining the next index after the last match with status "FINISHED"
      var lastIndex = 0;
      var len = this.league_matches.matches.length;
      for (let i = 0; i < len - 1; i++) {
        if (this.league_matches.matches[i].status === "FINISHED") {
          lastIndex = i;
        }
      }
      return this.league_matches.matches[lastIndex + 1];
    },
    sortedMatchDaysDisplayed() {
      return this.matchDaysDisplayed.sort((a, b) => a - b);
    }
  },

  methods: {
    onScroll() {
      window.onscroll = () => {
        if (document.documentElement.scrollTop < this.offsetTop) {
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
      console.log("Adding Next matches...");

      let arr = this.matchDaysDisplayed;
      let len = this.matchDaysDisplayed.length;
      let value = arr[len - 1] + 1;

      if (value > this.lastMatchDay) return; //We got the end of the matchDay current list
      //Check for duplicates
      if (arr.includes(value) === false) {
        this.matchDaysDisplayed.push(value);
      }
    },
    addPrevMatchDay() {
      console.log("Adding Previous matches...");

      let arr = this.matchDaysDisplayed;
      let value = arr[0] - 1;
      if (value < 1) return; //We got the start of the matchDay current list
      //Check for duplicates
      if (arr.includes(value) === false) {
        this.matchDaysDisplayed.unshift(value);
      }
    },

    getMatchesInMatchDay(m_day) {
      return this.league_matches.matches.filter(obj => obj.matchday === m_day);
    },

    getYearFromDate(strDate) {
      var d = new Date(strDate);
      return d.getFullYear();
    }
  },
  watch: {
    matchDaysDisplayed() {
      //scroll lazy load logic
      if (this.lastBottomHeight <= this.lastScrollHeight)
        document.documentElement.scrollTop +=
          document.documentElement.scrollHeight - this.lastScrollHeight;
    }
  }
};
</script>


<style>
.v-list__tile {
  padding-left: 0;
}
</style>
