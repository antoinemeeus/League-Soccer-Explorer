<template>
  <v-container
    column
    pt-2
    px-0
  >
    <!-- :style="clubColorStyle" -->
    <v-layout px-2>
      <v-flex xs3>
        <v-img
          :src="currentTeam.crestUrl"
          contain
          max-height="80px"
        />
      </v-flex>
      <v-flex
        pa-1
        xs9
      >
        <v-layout
          align-center
          fill-height
          wrap
        >
          <v-flex xs12>
            <h2>
              {{ currentTeam.name }}
            </h2>
          </v-flex>
          <v-flex xs12>
            <h6 class="caption grey--text">
              Team fonded in {{ currentTeam.founded }}
            </h6>
          </v-flex>
          <v-layout justify-space-between>
            <v-flex xs3>
              <v-menu
                v-model="website_menu"
                :close-on-content-click="false"
                auto
                offset-x
                offset-y
              >
                <v-btn
                  slot="activator"
                  color="indigo"
                  flat
                  icon
                >
                  <v-icon>mdi-web</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title color="primary">
                    <h4>
                      Website:
                      <a
                        :href="currentTeam.website"
                        target="_blank"
                      >{{
                          currentTeam.website
                        }}</a>
                    </h4>
                  </v-card-title>
                </v-card>
              </v-menu>
            </v-flex>

            <v-flex xs3>
              <v-menu
                v-model="website_eamil"
                :close-on-content-click="false"
                auto
                offset-x
                offset-y
              >
                <v-btn
                  slot="activator"
                  color="indigo"
                  flat
                  icon
                >
                  <v-icon>mdi-email</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title color="primary">
                    <h4>
                      Email:
                      <a :href="`mailto:${currentTeam.email}`">{{
                          currentTeam.email
                        }}</a>
                    </h4>
                  </v-card-title>
                </v-card>
              </v-menu>
            </v-flex>
            <v-flex xs3>
              <v-menu
                v-model="website_phone"
                :close-on-content-click="false"
                auto
                offset-x
                offset-y
              >
                <v-btn
                  slot="activator"
                  color="indigo"
                  flat
                  icon
                >
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title color="primary">
                    <h4>
                      Phone number:
                      <a :href="`tel://${currentTeam.phone}`">{{
                          currentTeam.phone
                        }}</a>
                    </h4>
                  </v-card-title>
                </v-card>
              </v-menu>
            </v-flex>

            <v-flex xs3>
              <v-menu
                v-model="website_map"
                :close-on-content-click="false"
                auto
                offset-x
                offset-y
              >
                <v-btn
                  slot="activator"
                  color="indigo"
                  flat
                  icon
                >
                  <v-icon>mdi-google-maps</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title color="primary">
                    <h4>
                      Stadium:
                      <a
                        :href="
                          `https://www.google.com/maps/search/?api=1&query=${currentTeam.venue}`
                        "
                        target="_blank"
                      >{{ currentTeam.venue }}</a>
                    </h4>
                  </v-card-title>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-divider/>
    <v-layout pt-2>
      <v-flex xs12>
        <v-tabs
          v-model="tabs"
          fixed-tabs
          grow
        >
          <v-tab>
            Players
          </v-tab>
          <v-tab>
            Standing
          </v-tab>
          <v-tab>
            Matches
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-tabs-items
      v-model="tabs"
      :touchless="tabs == 1"
      class="white elevation-1"
    >
      <v-tab-item>
        <TabPlayers
          v-if="!this.loadingPlayers"
          :players="team_players"
          :team-info="team_football_org"
        />

        <v-layout
          v-if="this.loadingPlayers"
          align-center
          fill-height
          justify-center
          row
        >
          <!-- <v-progress-circular
            size="50"
            color="primary"
            indeterminate
          ></v-progress-circular> -->

          <v-progress-linear
            :indeterminate="true"
            height="5"
          />
        </v-layout>
      </v-tab-item>

      <v-tab-item>
        <TabStanding :id_team="id_team"/>
      </v-tab-item>
      <v-tab-item>
        <TabMatches
          :competition-i-d="currentCompetition.id"
          :list_team_matches="matchesWithCrest"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

import TabMatches from "../components/TabMatches.vue";
import TabStanding from "../components/TabStanding.vue";
import TabPlayers from "../components/TabPlayers.vue";

export default {
  name: "TeamInfo",

  components: {
    TabMatches,
    TabStanding,
    TabPlayers
  },
  props: ["idCompetition", "idTeam", "displayedTeam"],
  data() {
    return {
      tabs: null,
      website_menu: false,
      website_eamil: false,
      website_phone: false,
      website_map: false
    };
  },
  created() {
    if (
      this.team_players.length > 1 &&
      !this.current_team_id &&
      this.current_team_id != this.team_players[0].idTeam
    ) {
      this.fetchPlayers({string_query: this.currentTeam.shortName});
    }
  },
  mounted() {
    this.setToolBarInfo();
  },

  beforeDestroy() {
  },

  computed: {
    ...mapState([
      "loadingPlayers",
      "team_players",
      "league_matches",
      "league_teams",
      "current_team_id",
      "team_football_org"
    ]),
    clubColorStyle() {
      var cur_color = "transparent";
      if (this.currentTeam.clubColors) {
        cur_color = this.currentTeam.clubColors.split("/")[0];
      }
      return {"background-color": cur_color};
    },
    currentTeam() {
      if (this.league_teams) {
        return this.league_teams.teams.find(obj => obj.id == this.id_team);
      } else {
        return this.displayed_team;
      }
    },
    currentCompetition() {
      return this.league_teams.competition;
    },
    matchesWithCrest() {
      var matches = this.league_matches.matches.filter(
        obj =>
          obj.homeTeam.id == this.id_team || obj.awayTeam.id === this.id_team
      );
      //Adding crestUrl to each matches homeTeam/awayTeam with information from league_teams
      return matches.map(obj => {
        var Tobj = obj;
        obj.homeTeam["crestUrl"] = this.league_teams.teams.find(
          elem => elem.id == Tobj.homeTeam.id
        ).crestUrl;
        obj.awayTeam["crestUrl"] = this.league_teams.teams.find(
          elem => elem.id == Tobj.awayTeam.id
        ).crestUrl;
        return obj;
      });
    }
  },

  methods: {
    ...mapActions(["fetchPlayers"]),
    setToolBarInfo() {
      this.$store.commit("SET_LEAGUE_ICON", this.league_teams.competition.code);
      this.$store.commit("SET_APP_TITLE", this.league_teams.competition.name);
      this.$store.commit("SET_CURRENT_LEAGUE", this.league_teams.competition);
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

<style scoped></style>
