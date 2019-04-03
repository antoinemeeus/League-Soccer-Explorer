<template>
  <v-container
    column
    px-0
  >
    <v-layout
      v-touch="{
      left: () => getNextMatch(), 
      right: () =>getPreviousMatch(),
    }"
      px-2
    >
      <v-icon @click="getPreviousMatch()">arrow_back_ios</v-icon>
      <v-flex xs12>
        <v-layout
          px-2
          pb-2
        >
          <v-flex xs6>
            <div class="headings">
              {{getLocalDateAndTime(currentMatch.utcDate)}}
            </div>
          </v-flex>
          <v-flex
            xs6
            text-xs-right
          >
            <div class="headings">
              {{currentMatch.status}}
            </div>
          </v-flex>
        </v-layout>
        <v-layout
          justify-space-around
          pt-2
          pa-1
        >

          <v-flex
            xs4
            text-xs-center
          >
            <router-link :to="{name:'teaminfo' , params:{ id_competition:this.id_competition ,id_team:matchHomeTeam.id, displayed_team:this.matchHomeTeam }}">
              <v-img
                :src="matchHomeTeam.crestUrl || require(`@/assets/placeholdershield.png`)"
                max-height="80px"
                contain
              ></v-img>
            </router-link>

          </v-flex>
          <v-layout
            px-2
            justify-space-between
            align-center
          >
            <h4 class=" display-1"> {{currentPeriodScore.homeTeam}} </h4>

            <div class=" subheader"> VS </div>

            <h4 class=" display-1"> {{currentPeriodScore.awayTeam}} </h4>

          </v-layout>
          <v-flex
            xs4
            text-xs-center
          >
            <router-link :to="{name:'teaminfo' , params:{ id_competition:this.id_competition,id_team:matchAwayTeam.id, displayed_team: matchAwayTeam }}">
              <v-img
                :src="matchAwayTeam.crestUrl || require(`@/assets/placeholdershield.png`)"
                max-height="80px"
                contain
              ></v-img>
            </router-link>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex
            xs4
            text-xs-center
          >
            <div class="my-3 subtitle">
              {{matchHomeTeam.shortName}}
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex
            xs4
            text-xs-center
          >
            <div class=" my-3 subtitle">
              {{matchAwayTeam.shortName}}
            </div>
          </v-flex>
        </v-layout>

      </v-flex>
      <v-icon @click="getNextMatch()">arrow_forward_ios</v-icon>
    </v-layout>

    <v-divider></v-divider>
    <div v-if="isDataAvailable">
      <v-layout
        px-3
        v-if="currentMatch.status!='SCHEDULED'"
        justify-space-between
      >
        <v-flex xs5>

          <v-layout
            pr-2
            py-1
            justify-space-between
            v-for="goalster in cur_goals_table.homeTeam"
            :key="goalster.id"
          >
            <span class="caption grey--text">
              {{goalster.scorer}}
            </span>
            <span class="caption grey--text">
              {{goalster.minute}}'
            </span>

          </v-layout>

        </v-flex>

        <v-flex
          xs2
          align-self-center
        >
          <v-img
            :src='require("@/assets/goalers.png")'
            contain
          >
          </v-img>
        </v-flex>
        <v-flex xs5>

          <v-layout
            pl-2
            py-1
            justify-space-between
            v-for="goalster in cur_goals_table.awayTeam"
            :key="goalster.id"
          >
            <span class="caption grey--text">
              {{goalster.scorer}}
            </span>
            <span class="caption grey--text">
              {{goalster.minute}}'
            </span>

          </v-layout>

        </v-flex>

      </v-layout>
      <v-divider></v-divider>

      <v-layout pt-2>
        <v-flex xs12>
          <v-tabs
            class="sticky-tabs"
            fixed-tabs
            v-model="tabs"
            grow
          >
            <v-tab>
              Lineups
            </v-tab>
            <v-tab>
              Stats
            </v-tab>
            <v-tab>
              Events
            </v-tab>
            <v-tab>
              Comments
            </v-tab>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-flex v-if="currentMatch.status=='SCHEDULED'">
        <v-alert
          :value="true"
          type="warning"
        >
          <h3 class="text-xs-center">
            Information not available yet.
          </h3>
        </v-alert>
      </v-flex>
      <v-tabs-items
        v-if="currentMatch.status!='SCHEDULED'"
        v-model="tabs"
        class="white elevation-1"
      >
        <v-tab-item>
          <LogoHeader
            title="Lineups"
            :homeLogoUrl="matchHomeTeam.crestUrl"
            :awayLogoUrl="matchAwayTeam.crestUrl"
          />

          <v-divider></v-divider>
          <TabLineup :list_="currentMatch_AdditionalInfo.lineup" />
          <v-divider></v-divider>
          <LogoHeader
            title="Substitutes"
            :homeLogoUrl="matchHomeTeam.crestUrl"
            :awayLogoUrl="matchAwayTeam.crestUrl"
          />
          <v-divider></v-divider>
          <TabLineup :list_="currentMatch_AdditionalInfo.bench" />
        </v-tab-item>

        <v-tab-item>
          <LogoHeader
            title="Team Stats"
            :homeLogoUrl="matchHomeTeam.crestUrl"
            :awayLogoUrl="matchAwayTeam.crestUrl"
          />
          <v-divider></v-divider>
          <TabStats :stats="cur_stats" />

        </v-tab-item>
        <v-tab-item>
          <LogoHeader
            title="Events"
            :homeLogoUrl="matchHomeTeam.crestUrl"
            :awayLogoUrl="matchAwayTeam.crestUrl"
          />
          <v-divider></v-divider>
          <TabEvents
            :Tgoals="currentMatch_AdditionalInfo.goals"
            :Tbookings="currentMatch_AdditionalInfo.bookings"
            :Tsubstitutions="currentMatch_AdditionalInfo.substitutions"
          />

        </v-tab-item>
        <v-tab-item>
          <LogoHeader
            title="Comments"
            :homeLogoUrl="matchHomeTeam.crestUrl"
            :awayLogoUrl="matchAwayTeam.crestUrl"
          />
          <v-divider></v-divider>
          <TabComment
            v-if="isAuthenticated"
            :match_id="currentMatch.id"
          />
          <Login v-if="!isAuthenticated" />

        </v-tab-item>
      </v-tabs-items>
    </div>
    <div v-if="!isDataAvailable">
      <v-alert
        :value="true"
        type="error"
      >
        This competition data is not available yet
      </v-alert>
    </div>
  </v-container>

</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import TabStats from "../components/TabStats.vue";
import TabLineup from "../components/TabLineup.vue";
import LogoHeader from "../components/LogoHeader.vue";
import TabEvents from "../components/TabEvents.vue";
import TabComment from "../components/TabComment.vue";
import Login from "./Login.vue";
export default {
  name: "MatchInfo",

  components: {
    TabStats,
    TabLineup,
    TabEvents,
    TabComment,
    LogoHeader,
    Login
  },
  props: ["id_competition", "id_match", "displayed_match"],
  data() {
    return {
      tabs: null,
      swipeDirection: "None",
      match_index: null
    };
  },

  mounted() {
    this.setToolBarInfo();
  },

  computed: {
    ...mapState([
      "loadingMatches",
      "loadingTeams",
      "league_competition",
      "league_matches",
      "league_matches_info",
      "league_teams"
    ]),
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentMatch() {
      var self = this;
      this.league_matches.matches.find((obj, idx) => {
        self.match_index = idx;
        return obj.id == this.id_match;
      });
      return (
        this.displayed_match ||
        this.league_matches.matches.find(obj => obj.id == this.id_match)
      );
    },
    isDataAvailable() {
      return this.league_matches_info.hasOwnProperty(
        this.id_competition || this.league_matches.competition.id
      );
    },
    currentMatch_AdditionalInfo() {
      if (this.league_matches_info[this.league_matches.competition.id]) {
        return this.league_matches_info[
          this.league_matches.competition.id
        ].find(
          obj =>
            obj.matchDay == this.currentMatch.matchday &&
            this.currentMatch.homeTeam.name.includes(
              obj.homeTeam.name.substring(0, 3)
            ) &&
            this.currentMatch.awayTeam.name.includes(
              obj.awayTeam.name.substring(0, 3)
            )
        );
      } else
        return {
          goals: [],
          substitutions: [],
          bookings: [],
          bench: [],
          lineup: []
        };
    },
    cur_stats() {
      //return list of objects
      return this.currentMatch_AdditionalInfo.stats;
    },
    cur_goals_table() {
      var homeTeamGoalsters = [];
      var awayTeamGoalsters = [];

      if (this.currentMatch_AdditionalInfo != undefined) {
        homeTeamGoalsters = this.currentMatch_AdditionalInfo.goals
          .filter(obj => obj.tType === "homeTeam")
          .map((obj, index) => {
            obj["id"] = index;
            return obj;
          });
        awayTeamGoalsters = this.currentMatch_AdditionalInfo.goals
          .filter(obj => obj.tType === "awayTeam")
          .map((obj, index) => {
            obj["id"] = index;
            return obj;
          });
      }
      return { homeTeam: homeTeamGoalsters, awayTeam: awayTeamGoalsters };
    },
    matchHomeTeam() {
      return this.league_teams.teams.find(
        obj => obj.id === this.currentMatch.homeTeam.id
      );
    },
    matchAwayTeam() {
      return this.league_teams.teams.find(
        obj => obj.id === this.currentMatch.awayTeam.id
      );
    },
    currentPeriodScore() {
      var _score = this.currentMatch.score;
      if (_score.fullTime.homeTeam != null || _score.fullTime.awayTeam != null)
        return _score.fullTime;
      else return _score.halfTime;
    }
  },

  methods: {
    ...mapActions([
      "fetchAPI",
      "fetchMatches",
      "fetchEventInfo",
      "fetchTeams",
      "fetchTeamInfo"
    ]),
    setToolBarInfo() {
      this.$store.commit(
        "SET_LEAGUE_ICON",
        this.league_matches.competition.code
      );
      this.$store.commit("SET_APP_TITLE", this.league_matches.competition.name);
      this.$store.commit("SET_CURRENT_LEAGUE", this.league_matches.competition);
    },
    getPreviousMatch() {
      var newIndex = this.match_index - 1;
      //check if no at index 0 or lenght-1
      if (newIndex < 0) newIndex = this.match_index;
      var prev_match = this.league_matches.matches[newIndex];
      var prev_id = prev_match.id;
      this.$router.replace({
        name: "matchinfo",
        params: {
          id_competition: this.id_competition,
          id_match: prev_id,
          displayed_match: prev_match
        }
      });
    },
    getNextMatch() {
      var newIndex = this.match_index + 1;
      //check if no at index 0 or lenght-1
      if (newIndex > this.league_matches.matches.length - 1)
        newIndex = this.match_index;

      var next_match = this.league_matches.matches[newIndex];
      var next_id = next_match.id;
      this.$router.replace({
        name: "matchinfo",
        params: {
          id_competition: this.id_competition,
          id_match: next_id,
          displayed_match: next_match
        }
      });
    },
    getLocalDateAndTime(utcD) {
      var localDate = new Date(utcD);
      var options = {
        weekday: "short",
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
      return localDate.toLocaleDateString("en-GB", options);
    }
  }
};
</script>
<style scoped>
.sticky-tabs {
  position: sticky;
  top: 80px;
}
</style>
