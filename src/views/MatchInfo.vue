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
    </v-layout>
    <v-divider></v-divider>
    <v-layout
      v-if="currentMatch.status!='SCHEDULED'"
      justify-space-between
    >
      <v-flex xs5>
        <v-list>
          <v-layout
            pr-2
            justify-space-between
            v-for="goalster in cur_goals_table.homeTeam"
            :key="goalster.id"
          >
            <span class="caption">
              {{goalster.scorer}}
            </span>
            <span class="caption">
              {{goalster.minute}}'
            </span>

          </v-layout>

        </v-list>
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
        <v-list>
          <v-layout
            pl-2
            justify-space-between
            v-for="goalster in cur_goals_table.awayTeam"
            :key="goalster.id"
          >
            <span class="caption">
              {{goalster.scorer}}
            </span>
            <span class="caption">
              {{goalster.minute}}'
            </span>

          </v-layout>

        </v-list>
      </v-flex>

    </v-layout>
    <v-divider></v-divider>
    <v-layout pt-3>
      <v-flex xs12>
        <v-tabs
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
            Standing
          </v-tab>
          <v-tab>
            News
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-tabs-items
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
        <TabLineup :list_="currentMatch_AdditionalInfo.lineup" />
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
        <v-card>
          <v-card-text>Tab2</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>

</template>

<script>
import { mapState } from "vuex";
import TabStats from "../components/TabStats.vue";
import TabLineup from "../components/TabLineup.vue";
import LogoHeader from "../components/LogoHeader.vue";

export default {
  name: "MatchInfo",

  components: {
    TabStats,
    TabLineup,
    LogoHeader
  },
  props: ["id_match", "displayed_match"],
  data() {
    return {
      tabs: null
    };
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
    currentMatch_AdditionalInfo() {
      var add_info = this.league_matches_info.find(obj => {
        var test1 = obj.utcDate === this.currentMatch.utcDate;
        if (!test1 && obj.matchDay == this.currentMatch.matchday) {
          var test1 =
            this.currentMatch.homeTeam.name.includes(
              obj.homeTeam.name.substring(0, 3)
            ) &&
            this.currentMatch.awayTeam.name.includes(
              obj.awayTeam.name.substring(0, 3)
            );
        }
        return test1;
      });
      return add_info;
    },
    cur_stats() {
      //return list of objects
      return this.currentMatch_AdditionalInfo.stats;
    },
    cur_goals_table() {
      var homeTeamGoalsters = this.currentMatch_AdditionalInfo.goals
        .filter(obj => obj.tType === "homeTeam")
        .map((obj, index) => {
          obj["id"] = index;
          return obj;
        });
      var awayTeamGoalsters = this.currentMatch_AdditionalInfo.goals
        .filter(obj => obj.tType === "awayTeam")
        .map((obj, index) => {
          obj["id"] = index;
          return obj;
        });

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
