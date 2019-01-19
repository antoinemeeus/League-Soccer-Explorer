<template>

  <v-container fluid>
    <v-layout
      justify-center
      pb-2
    >
      <v-progress-circular
        v-if="isCardInbound"
        size="50"
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
          />
        </v-flex>
      </v-layout>

    </v-layout>
    <v-layout
      justify-center
      pt-2
    >
      <v-progress-circular
        v-if="isCardInbound"
        size="50"
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
  name: "MatchesList",

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
    //Update League Logo
    //We add current and previous matchday to list
    this.matchDaysDisplayed.push(this.currentMatchDay);
    this.currentMatchDay - 1 >= 0
      ? this.matchDaysDisplayed.push(this.currentMatchDay - 1)
      : null;
  },

  mounted() {
    //jump to current or nextMatch
    let self = this;
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
    isCardInbound() {
      var len = this.sortedMatchDaysDisplayed.length;
      return (
        this.sortedMatchDaysDisplayed[0] > 1 &&
        this.sortedMatchDaysDisplayed[len - 1] < this.lastMatchDay
      );
    },
    currentLeagueInfo() {
      return this.league_competition.competitions.find(
        obj => obj.id == this.id_competition
      );
    },
    matchesWithCrest() {
      //Adding crestUrl to each matches homeTeam/awayTeam with information from league_teams
      return this.league_matches.matches.map(obj => {
        var Tobj = obj;
        obj.homeTeam["crestUrl"] = this.league_teams.teams.find(
          elem => elem.id == Tobj.homeTeam.id
        ).crestUrl;
        obj.awayTeam["crestUrl"] = this.league_teams.teams.find(
          elem => elem.id == Tobj.awayTeam.id
        ).crestUrl;
        return obj;
      });
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
    setToolBarInfo() {
      if (currentLeagueInfo.code) {
        this.$store.commit("SET_LEAGUE_ICON", this.currentLeagueInfo.code);
        this.$store.commit("SET_APP_TITLE", this.currentLeagueInfo.name);
        this.$store.commit("SET_CURRENT_LEAGUE", this.currentLeagueInfo);
      }
    },
    onScroll() {
      window.onscroll = _.debounce(() => {
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
      }, 800);
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
      return this.matchesWithCrest.filter(obj => obj.matchday === m_day);
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
    },
    currentLeagueInfo() {
      this.setToolBarInfo();
    }
  }
};
</script>


<style>
.v-list__tile {
  padding-left: 0;
}
</style>
