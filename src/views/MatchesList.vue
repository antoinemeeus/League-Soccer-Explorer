<template>

  <v-container fluid>
    <v-layout
      justify-center
      pb-2
    >
      <v-progress-circular
        v-show="isLitTop"
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
        <h2
          v-if="regularSeasonOrCups"
          class="title py-3"
        >Matchday {{matchDay}} of {{lastMatchDay}}</h2>
        <h2
          v-if="!regularSeasonOrCups"
          class="title py-3"
        >Stage {{matchDay}}</h2>
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
            :leagueCompetitionID="id_competition"
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
        v-show="isListBottom"
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
import { mapActions } from "vuex";

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
      scrollOptions: {
        duration: 300,
        offset: 0,
        easing: "easeInOutCubic"
      }
    };
  },
  created() {},

  mounted() {
    //jump to current or nextMatch
    console.log(document.querySelector(".scroll_target"));
    this.$nextTick(function() {
      console.log(document.querySelector(".scroll_target"));
      // Code that will run only after the
      // entire view has been rendered
      var el = document.querySelector(".scroll_target");
      console.log("Element with target of scroll?", el);
      var vOffset =
        // el.getBoundingClientRect().top +
        // document.documentElement.scrollTop -
        window.innerHeight / 2;
      console.log(vOffset);
      this.$vuetify.goTo(el, {
        duration: 300,
        offset: -vOffset,
        easing: "easeInOutCubic"
      });
    });

    this.$store.commit("SET_LEAGUE_ICON", this.currentLeagueInfo.code);
    this.$store.commit("SET_APP_TITLE", this.currentLeagueInfo.name);
    this.$store.commit("SET_CURRENT_LEAGUE", this.currentLeagueInfo);

    this.onScroll();

    this.matchDaysDisplayed.push(this.currentMatchDay);
    this.currentMatchDay - 1 >= 0
      ? this.matchDaysDisplayed.push(this.currentMatchDay - 1)
      : null;
    this.currentMatchDay + 1 <= this.lastMatchDay
      ? this.matchDaysDisplayed.push(this.currentMatchDay + 1)
      : null;
  },

  beforeDestroy() {
    //destroy windows scroll listener
    console.log("Destroy scroll listener");
    window.onscroll = null;
  },

  computed: {
    ...mapState([
      "loadingMatches",
      "loadingTeams",
      "league_competition",
      "league_matches",
      "league_teams"
    ]),

    regularSeasonOrCups() {
      if (this.league_matches.matches) {
        var matches_ = this.league_matches.matches;
        if (matches_.length > 0)
          if (matches_[0].stage == "REGULAR_SEASON") {
            return true;
          }
      }
      return false;
    },

    isLitTop() {
      return this.sortedMatchDaysDisplayed[0] > 1;
    },
    isListBottom() {
      var len = this.sortedMatchDaysDisplayed.length;
      return this.sortedMatchDaysDisplayed[len - 1] < this.lastMatchDay;
    },
    currentLeagueInfo() {
      return this.league_matches.competition;
    },
    currentMatchDay() {
      return this.league_matches.matches[0].season.currentMatchday;
    },
    lastMatchDay() {
      //Have to check if in stage is regular seagon
      var matches_ = this.league_matches.matches;
      if (matches_.length > 0) {
        var len = matches_.length;
        var lastday = matches_[len - 1].matchday;
        if (lastday) return lastday;
        else {
          return Math.max(this.league_matches.matches.map(obj => obj.matchday));
        }
      }
    },
    matchesWithCrest() {
      //Adding crestUrl to each matches homeTeam/awayTeam with information from league_teams
      if (this.league_teams.teams.length > 0)
        return this.league_matches.matches.map(obj => {
          var Tobj = obj;
          var _homeTeam = this.league_teams.teams.find(
            elem => elem.id == Tobj.homeTeam.id
          );
          var _awayTeam = this.league_teams.teams.find(
            elem => elem.id == Tobj.awayTeam.id
          );
          obj.homeTeam["crestUrl"] = _homeTeam.crestUrl
            ? _homeTeam.crestUrl
            : require("@/assets/placeholdershield.png");
          obj.awayTeam["crestUrl"] = _awayTeam.crestUrl
            ? _awayTeam.crestUrl
            : require("@/assets/placeholdershield.png");
          return obj;
        });
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
    ...mapActions(["fetchAPI", "fetchTeamInfo"]),
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
    // matchDaysDisplayed() {
    //   //scroll lazy load logic
    //   if (this.lastBottomHeight <= this.lastScrollHeight)
    //     document.documentElement.scrollTop +=
    //       document.documentElement.scrollHeight - this.lastScrollHeight;
    // }
  }
};
</script>