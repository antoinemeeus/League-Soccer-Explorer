<template>
  <v-container
    px-1
    class="stickyPos elevation-4"
  >
    <v-layout
      justify-space-between
      align-center
    >
      <v-flex
        xs2
        class="text-xs-center"
      >
        <v-icon
          :disabled="selectedMatchDay<=1"
          @click="previousMDay"
        >arrow_back_ios</v-icon>
      </v-flex>

      <v-select
        :items="matchdayList"
        v-model="selectedMatchDay"
        box
        single-line
        hide-details
        dont-fill-mask-blanks
      >
        <template
          slot="selection"
          slot-scope="{ item }"
        >
          <v-layout justify-space-between>
            <span>{{item.name}} {{item.value}}</span>
            <span
              pb-1
              class="caption"
            >{{formatDates(item.startDate,item.endDate)}}</span>
          </v-layout>
        </template>
        <template
          slot="item"
          slot-scope="{ item }"
        >
          <v-list
            class="transparent"
            two-line
            ripple
          >
            <v-list-tile-content>
              <v-list-tile-title>
                {{item.name}} {{item.value}}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{formatDates(item.startDate,item.endDate)}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list>
        </template>

      </v-select>

      <v-flex
        xs2
        class="text-xs-center"
      >
        <v-icon
          :disabled="selectedMatchDay>=matchdayList.length"
          @click="nextMDay"
        >arrow_forward_ios</v-icon>
      </v-flex>
    </v-layout>

    <v-layout>
      <h2 class="title py-3">Matchday {{selectedMatchDay}} of {{matchdayList.length}}</h2>
    </v-layout>

    <v-layout
      wrap
      justify-center
      v-for="match in getMatchesInMatchDay(selectedMatchDay)"
      :key="match.id"
    >
      <v-flex
        sm6
        xs12
        class="py-1"
        :class="{'scroll_target current-match-card': match.id===nextMatch.id}"
      >
        <MatchCard
          :leagueCompetitionID="id_competition"
          :iscurrentMatch="match.id===nextMatch.id"
          :indvMatch="match"
        />
      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import moment from "moment";
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
      selectedMatchDay: 1,
      matchDaysDisplayed: []
    };
  },
  mounted() {
    //jump to current or nextMatch
    this.setToolBarInfo();
    //set matchday page if we go back
    this.selectedMatchDay = this.nextMatch.matchday;

    this.matchDaysDisplayed.push(this.currentMatchDay);

    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      this.goToNextMatch();
    });
  },

  computed: {
    ...mapState([
      "league_competition",
      "league_matches",
      "league_teams",
      "goToCurrent",
      "selectedMDay"
    ]),

    matchdayList() {
      //Method to extract the matchday of list of matches and their start and end Dates.
      let matches = this.league_matches.matches;
      if (matches) {
        let previousMDay = matches[0].matchday;
        let dateStart,
          dateEnd = moment();
        let matchDayItems = [];
        let DateStart = moment(matches[0].utcDate);
        //Loop trhough array until -1
        for (let i = 0; i < matches.length - 2; i++) {
          let curMatchday = matches[i].matchday;
          let nextMatchday = matches[i + 1].matchday;
          if (nextMatchday > curMatchday) {
            matchDayItems.push({
              name: "Matchday",
              value: curMatchday,
              startDate: DateStart,
              endDate: moment(matches[i].utcDate)
            });
            DateStart = moment(matches[i + 1].utcDate);
          }
        }
        //Add last item on array because you can't check outside of array bounds
        let lastMatch = matches[matches.length - 1];
        matchDayItems.push({
          name: "Matchday",
          value: lastMatch.matchday,
          startDate: DateStart,
          endDate: moment(lastMatch.utcDate)
        });
        return matchDayItems;
      }
      return [];
    },

    currentLeagueInfo() {
      return this.league_matches.competition;
    },
    currentMatchDay() {
      return this.league_matches.matches[0].season.currentMatchday;
    },
    lastMatchDay() {
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

    formatDates(startD, endD) {
      if (moment(startD).isSame(endD, "month")) {
        return startD.format("DD") + " - " + endD.format("DD MMM");
      }
      return startD.format("DD MMM") + " - " + endD.format("DD MMM");
    },
    setToolBarInfo() {
      this.$store.commit("SET_LEAGUE_ICON", this.currentLeagueInfo.code);
      this.$store.commit("SET_APP_TITLE", this.currentLeagueInfo.name);
      this.$store.commit("SET_CURRENT_LEAGUE", this.currentLeagueInfo);
    },
    goToNextMatch() {
      var el = document.querySelector(".scroll_target");
      if (el) {
        var vOffset = window.innerHeight / 2 - el.clientHeight / 2;
        this.$vuetify.goTo(el, {
          duration: 0,
          offset: -vOffset,
          easing: "easeInOutCubic"
        });
      }
    },
    previousMDay() {
      if (this.selectedMatchDay > 1) this.selectedMatchDay -= 1;
    },
    nextMDay() {
      if (this.selectedMatchDay < this.matchdayList.length)
        this.selectedMatchDay += 1;
    },
    getMatchesInMatchDay(m_day) {
      return this.matchesWithCrest.filter(obj => obj.matchday === m_day);
    }
  },
  updated() {},
  watch: {
    goToCurrent() {
      this.selectedMatchDay = this.nextMatch.matchday;
      this.goToNextMatch();
    },
    selectedMatchDay() {
      this.$store.commit("setSelectedMDay", this.selectedMatchDay);
    }
  }
};
</script>

