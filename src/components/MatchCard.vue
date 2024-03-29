<template>
  <v-card
    :raised="iscurrentMatch"
    :color="dynamicColor"
    :to="{
      name: 'matchinfo',
      params: {
        idCompetition: leagueCompetitionId,
        idMatch: indvMatch.id,
        displayedMatch: indvMatch
      }
    }"
  >
    <v-container fluid>
      <v-layout
        row
        justify-space-between
      >
        <v-flex>{{ getLocalDateAndTime(indvMatch.utcDate) }}</v-flex>
        <v-spacer />
        <v-flex class="text-xs-right">
          {{ indvMatch.status }}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-layout column>
          <v-flex xs9>
            <v-list-tile>
              <v-list-tile-avatar size="40">
                <v-img
                  class="elevation-6"
                  contain
                  :src="getImgSrc(indvMatch.homeTeam.crestUrl)"
                />
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  :class="{ 'grey--text': isAwayWinner }"
                >
                  {{ indvMatch.homeTeam.name }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-layout
                align-center
                justify-end
              >
                <h4>{{ periodScore.score.homeTeam }}</h4>
              </v-layout>
            </v-list-tile>
          </v-flex>
          <v-flex xs9>
            <v-list-tile>
              <v-list-tile-avatar size="40">
                <v-img
                  class="elevation-6"
                  contain
                  :src="getImgSrc(indvMatch.awayTeam.crestUrl)"
                />
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  :class="{ 'grey--text text--darken-2': isHomeWinner }"
                >
                  {{ indvMatch.awayTeam.name }}
                </v-list-tile-title>
              </v-list-tile-content>

              <v-layout
                align-center
                justify-end
              >
                <h4>{{ periodScore.score.awayTeam }}</h4>
              </v-layout>
            </v-list-tile>
          </v-flex>
        </v-layout>
        <v-divider
          class="mx-1"
          inset
          vertical
        />
        <v-flex
          v-show="isSchedule"
          xs2
          align-self-center
        >
          <h5 class="text-xs-center">
            {{ moment(indvMatch.utcDate).calendar() }}
          </h5>
        </v-flex>
        <v-flex
          v-show="!isSchedule"
          xs2
          align-self-center
        >
          <h5 class="text-xs-center">
            {{ periodScore.name }}
          </h5>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>

export default {
    name: "MatchCard",
    props: {
        leagueCompetitionId: Number,
        indvMatch: Object,
        iscurrentMatch: Boolean,
    },
    data: () => ({}),
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
            return this.iscurrentMatch ? "blue-grey lighten-3" : "";
        },
        periodScore() {
            let _score = this.indvMatch.score;
            let obj = {name: "Scheduled", score: _score.halfTime};
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
    },
    methods: {
        getLocalDateAndTime(utcD) {
            let localDate = new Date(utcD);
            const options = {
                weekday: "short",
                year: "2-digit",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            };
            return localDate.toLocaleDateString("en-GB", options);
        },
        getImgSrc(src) {
            if (src) return src;
            return require("@/assets/placeholdershield.png");
        },
        testPeriodScore(obj) {
            return obj.homeTeam != null || obj.awayTeam != null;
        }
    }
};
</script>
