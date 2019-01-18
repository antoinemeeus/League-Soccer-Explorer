<template>
  <v-card
    :raised="iscurrentMatch"
    :color="dynamicColor"
    :to="{ name: 'matchinfo' , params:{ id_match:indvMatch.id, displayed_match:indvMatch }}"
  >
    <v-container fluid>
      <v-layout
        row
        justify-space-between
      >
        <v-flex>{{getLocalDateAndTime(indvMatch.utcDate)}} </v-flex>
        <v-spacer></v-spacer>
        <v-flex class="text-xs-right">{{indvMatch.status}} </v-flex>
      </v-layout>
      <v-layout row>
        <v-layout column>
          <v-flex xs9>
            <v-list-tile>
              <v-list-tile-avatar
                size="40"
                color="grey darken-3"
              >
                <v-img
                  class="elevation-6"
                  :src="indvMatch.homeTeam.crestUrl"
                ></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  :class="{'grey--text': isAwayWinner}"
                >{{indvMatch.homeTeam.name}}</v-list-tile-title>
              </v-list-tile-content>
              <v-layout
                align-center
                justify-end
              >
                <h4>{{periodScore.score.homeTeam}}</h4>
              </v-layout>
            </v-list-tile>
          </v-flex>
          <v-flex xs9>
            <v-list-tile>
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  size="40"
                  :src="indvMatch.awayTeam.crestUrl"
                ></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  :class="{'grey--text':isHomeWinner}"
                >{{indvMatch.awayTeam.name}}</v-list-tile-title>
              </v-list-tile-content>

              <v-layout
                align-center
                justify-end
              >
                <h4>{{periodScore.score.awayTeam}}</h4>
              </v-layout>

            </v-list-tile>
          </v-flex>
        </v-layout>
        <v-divider
          class="mx-1"
          inset
          vertical
        ></v-divider>
        <v-flex
          v-show="isSchedule"
          xs2
          align-self-center
        >
          <h5 class="text-xs-center">{{getLocalDateAndTime(indvMatch.utcDate)}}</h5>
        </v-flex>
        <v-flex
          v-show="!isSchedule"
          xs2
          align-self-center
        >
          <h5 class="text-xs-center">{{periodScore.name}}</h5>
        </v-flex>
      </v-layout>
    </v-container>

  </v-card>

</template>

<script>
export default {
  name: "MatchCard",
  props: ["indvMatch", "iscurrentMatch"],
  data: () => ({}),
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
    },
    testPeriodScore(obj) {
      return obj.homeTeam != null || obj.awayTeam != null;
    }
  },

  computed: {
    isHomeWinner() {
      return this.indvMatch.score.winner === "HOME_TEAM";
    },
    isAwayWinner() {
      return this.indvMatch.score.winner === "AWAY_TEAM";
    },
    localTime() {
      return this.getLocalDateAndTime(this.indvMatch.utcDate);
    },
    isSchedule() {
      return this.indvMatch.status === "SCHEDULED";
    },
    dynamicColor() {
      return this.iscurrentMatch ? "grey" : "";
    },
    periodScore() {
      var _score = this.indvMatch.score;
      var obj = { name: "Scheduled", score: _score.halfTime };
      if (this.testPeriodScore(_score.halfTime)) {
        obj.name = "HT";
        obj.score = _score.halfTime;
      }
      if (this.testPeriodScore(_score.fullTime)) {
        obj.name = "FT";
        obj.score = _score.fullTime;
      }
      return obj;
    }
  }
};
</script>
