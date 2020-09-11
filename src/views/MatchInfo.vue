<template>
  <v-container
    column
    px-0
  >
    <v-layout
      v-touch="{
        left: () => getNextMatch(),
        right: () => getPreviousMatch()
      }"
      px-2
    >
      <v-icon @click="getPreviousMatch()">
        arrow_back_ios
      </v-icon>
      <v-flex xs12>
        <v-layout
          pb-2
          px-2
        >
          <v-flex xs6>
            <div class="headings">
              {{ getLocalDateAndTime(currentMatch.utcDate) }}
            </div>
          </v-flex>
          <v-flex
            text-xs-right
            xs6
          >
            <div class="headings">
              {{ currentMatch.status }}
            </div>
          </v-flex>
        </v-layout>
        <v-layout
          justify-space-around
          pa-1
          pt-2
        >
          <v-flex
            text-xs-center
            xs4
          >
            <router-link
              :to="{
                name: 'teaminfo',
                params: {
                  idCompetition: idCompetition,
                  idTeam: matchHomeTeam.id,
                  displayedTeam: matchHomeTeam
                }
              }"
            >
              <v-img
                :src="
                  matchHomeTeam.crestUrl ||
                    require(`@/assets/placeholdershield.png`)
                "
                contain
                max-height="80px"
              />
            </router-link>
          </v-flex>
          <v-layout
            align-center
            justify-space-between
            px-2
          >
            <h4 class=" display-1">
              {{ currentPeriodScore.homeTeam }}
            </h4>

            <div class=" subheader">
              VS
            </div>

            <h4 class=" display-1">
              {{ currentPeriodScore.awayTeam }}
            </h4>
          </v-layout>
          <v-flex
            text-xs-center
            xs4
          >
            <router-link
              :to="{
                name: 'teaminfo',
                params: {
                  idCompetition: idCompetition,
                  idTeam: matchAwayTeam.id,
                  displayedTeam: matchAwayTeam
                }
              }"
            >
              <v-img
                :src="
                  matchAwayTeam.crestUrl ||
                    require(`@/assets/placeholdershield.png`)
                "
                contain
                max-height="80px"
              />
            </router-link>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex
            text-xs-center
            xs4
          >
            <div class="my-3 subtitle">
              {{ matchHomeTeam.shortName }}
            </div>
          </v-flex>
          <v-spacer />
          <v-flex
            text-xs-center
            xs4
          >
            <div class=" my-3 subtitle">
              {{ matchAwayTeam.shortName }}
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-icon @click="getNextMatch()">
        arrow_forward_ios
      </v-icon>
    </v-layout>

    <v-divider />
    <div v-if="isDataAvailable">
      <v-layout
        v-if="currentMatch.status !== 'SCHEDULED'"
        justify-space-between
        px-3
      >
        <v-flex xs5>
          <v-layout
            v-for="goalster in cur_goals_table.homeTeam"
            :key="goalster.id"
            justify-space-between
            pr-2
            py-1
          >
            <span class="caption grey--text">
              {{ goalster.scorer }}
            </span>
            <span class="caption grey--text"> {{ goalster.minute }}' </span>
          </v-layout>
        </v-flex>

        <v-flex
          align-self-center
          xs2
        >
          <v-img
            :src="require('@/assets/goalers.png')"
            contain
          />
        </v-flex>
        <v-flex xs5>
          <v-layout
            v-for="goalster in cur_goals_table.awayTeam"
            :key="goalster.id"
            justify-space-between
            pl-2
            py-1
          >
            <span class="caption grey--text">
              {{ goalster.scorer }}
            </span>
            <span class="caption grey--text"> {{ goalster.minute }}' </span>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider />

      <v-layout pt-2>
        <v-flex xs12>
          <v-tabs
            v-model="tabs"
            class="sticky-tabs"
            fixed-tabs
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
      <v-flex v-if="currentMatch.status === 'SCHEDULED'">
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
        v-if="currentMatch.status !== 'SCHEDULED'"
        v-model="tabs"
        class="white elevation-1"
      >
        <v-tab-item>
          <LogoHeader
            :away-logo-url="matchAwayTeam.crestUrl"
            :home-logo-url="matchHomeTeam.crestUrl"
            title="Lineups"
          />

          <v-divider />
          <TabLineup :list_="currentMatch_AdditionalInfo.lineup" />
          <v-divider />
          <LogoHeader
            :away-logo-url="matchAwayTeam.crestUrl"
            :home-logo-url="matchHomeTeam.crestUrl"
            title="Substitutes"
          />
          <v-divider />
          <TabLineup :list_="currentMatch_AdditionalInfo.bench" />
        </v-tab-item>

        <v-tab-item>
          <LogoHeader
            :away-logo-url="matchAwayTeam.crestUrl"
            :home-logo-url="matchHomeTeam.crestUrl"
            title="Team Stats"
          />
          <v-divider />
          <TabStats :stats="cur_stats" />
        </v-tab-item>
        <v-tab-item>
          <LogoHeader
            :away-logo-url="matchAwayTeam.crestUrl"
            :home-logo-url="matchHomeTeam.crestUrl"
            title="Events"
          />
          <v-divider />
          <TabEvents
            :tbookings="currentMatch_AdditionalInfo.bookings"
            :tgoals="currentMatch_AdditionalInfo.goals"
            :tsubstitutions="currentMatch_AdditionalInfo.substitutions"
          />
        </v-tab-item>
        <v-tab-item>
          <LogoHeader
            :away-logo-url="matchAwayTeam.crestUrl"
            :home-logo-url="matchHomeTeam.crestUrl"
            title="Comments"
          />
          <v-divider />
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
import {mapActions, mapState} from "vuex";
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
  props: ["idCompetition", "idMatch", "displayedMatch"],
  data() {
    return {
      tabs: null,
      swipeDirection: "None",
      match_index: null
    };
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
      let self = this;
      this.league_matches.matches.find((obj, idx) => {
        self.match_index = idx;
        return obj.id == this.idMatch;
      });
      return (
        this.displayedMatch ||
        this.league_matches.matches.find(obj => obj.id == this.idMatch)
      );
    },
    isDataAvailable() {
      return this.league_matches_info.hasOwnProperty(
        this.idCompetition || this.league_matches.competition.id
      );
    },
    currentMatch_AdditionalInfo() {
      if (this.league_matches_info[this.league_matches.competition.id]) {
        let cMatch_AddInfo = this.league_matches_info[
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
        if (cMatch_AddInfo != null) return cMatch_AddInfo;
      }
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
      let homeTeamGoalsters = [];
      let awayTeamGoalsters = [];

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
      return {homeTeam: homeTeamGoalsters, awayTeam: awayTeamGoalsters};
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
      let _score = this.currentMatch.score;
      if (_score.fullTime.homeTeam != null || _score.fullTime.awayTeam != null)
        return _score.fullTime;
      else return _score.halfTime;
    }
  },
  mounted() {
    this.setToolBarInfo();
  },
  methods: {
    ...mapActions([
      "fetchAPI"
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
      let newIndex = this.match_index - 1;
      //check if no at index 0 or length-1
      if (newIndex < 0) newIndex = this.match_index;
      let prev_match = this.league_matches.matches[newIndex];
      let prev_id = prev_match.id;
      this.$router.replace({
        name: "matchinfo",
        params: {
          idCompetition: this.idCompetition,
          idMatch: prev_id,
          displayedMatch: prev_match
        }
      });
    },
    getNextMatch() {
      let newIndex = this.match_index + 1;
      //check if no at index 0 or length-1
      if (newIndex > this.league_matches.matches.length - 1)
        newIndex = this.match_index;

      let next_match = this.league_matches.matches[newIndex];
      let next_id = next_match.id;
      this.$router.replace({
        name: "matchinfo",
        params: {
          idCompetition: this.idCompetition,
          idMatch: next_id,
          displayedMatch: next_match
        }
      });
    },
    getLocalDateAndTime(utcD) {
      let localDate = new Date(utcD);
      let options = {
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
