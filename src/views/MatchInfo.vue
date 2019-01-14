<template>
  <v-container fluid>
    <v-layout>
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
            <v-img
              :src="matchHomeTeam.crestUrl"
              max-height="80px"
              contain
            ></v-img>

          </v-flex>
          <v-layout
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
            <v-img
              :src="matchAwayTeam.crestUrl"
              max-height="80px"
              contain
            ></v-img>

          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex
            xs4
            text-xs-center
          >
            <div class="my-3 title">
              {{matchHomeTeam.shortName}}
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex
            xs4
            text-xs-center
          >
            <div class=" my-3 title">
              {{matchAwayTeam.shortName}}
            </div>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout
      v-if="currentMatch.status!='SCHEDULED'"
      justify-space-between
    >
      <v-flex xs4>

        <v-list>
          <div class="text-xs-center">
            Goaler X 50'
          </div>
          <div class="text-xs-center">
            Goaler Y 10'
          </div>

        </v-list>
      </v-flex>

      <v-flex xs4>
        <v-img
          :src='require("@/assets/goalers.png")'
          contain
        >
        </v-img>
      </v-flex>
      <v-flex xs4>
        <v-list>
          <div class="text-xs-center">
            Goaler Z 6'
          </div>
        </v-list>
      </v-flex>

    </v-layout>
    <v-divider></v-divider>
    <v-layout pt-3>
      <v-flex xs12>
        <v-tabs fixed-tabs>
          <v-tab>
            Lineups
          </v-tab>
          <v-tab>
            Standing
          </v-tab>
          <v-tab>
            News
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MatchInfo",

  components: {},
  props: ["id_match", "displayed_match"],
  data() {
    return {};
  },
  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  computed: {
    ...mapState([
      "league_competition",
      "league_matches",
      "league_matches_info",
      "league_teams"
    ]),

    currentMatch() {
      return (
        this.displayed_match ||
        this.league_matches.matches.find(obj => obj.id == this.id_match)
      );
    },
    currentMatchLineUp() {
      //Check if the current match has lineup
      return this.league_matches_info.filter(
        obj => obj.matchDay === currentMatch.matchday
      );
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
  },
  watch: {}
};
</script>
