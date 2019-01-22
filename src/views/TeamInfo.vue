<template>
  <v-container
    column
    px-0
    pt-2
  >
    <!-- :style="clubColorStyle" -->
    <v-layout px-2>

      <v-flex xs3>
        <v-img
          :src="currentTeam.crestUrl"
          max-height="80px"
          contain
        ></v-img>
      </v-flex>
      <v-flex
        xs9
        pa-1
      >
        <v-layout
          align-center
          wrap
          fill-height
        >
          <v-flex xs12>
            <h2>
              {{currentTeam.name}}
            </h2>
          </v-flex>
          <v-flex xs12>
            <h6 class="caption grey--text">
              Team fonded in {{currentTeam.founded}}
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
                    <h4>Website:
                      <a
                        :href="currentTeam.website"
                        target="_blank"
                      >{{currentTeam.website}}</a>
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
                    <h4>Email:
                      <a :href="`mailto:${currentTeam.email}`">{{currentTeam.email}}</a>
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
                    <h4>Phone number:
                      <a :href="`tel://${currentTeam.phone}`">{{currentTeam.phone}}</a>
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
                    <h4>Stadium:
                      <a
                        target="_blank"
                        :href="`https://www.google.com/maps/search/?api=1&query=${currentTeam.venue}`"
                      >{{currentTeam.venue}}</a>
                    </h4>
                  </v-card-title>
                </v-card>
              </v-menu>
            </v-flex>

          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>
    <v-layout pt-2>
      <v-flex xs12>
        <v-tabs
          fixed-tabs
          v-model="tabs"
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
      :touchless="tabs==1"
      class="white elevation-1"
    >
      <v-tab-item>
        <TabPlayers
          :players="team_players"
          :teamInfo="team_football_org"
        />
      </v-tab-item>

      <v-tab-item>
        <TabStanding :id_team="id_team" />
      </v-tab-item>
      <v-tab-item>

        <TabMatches :list_team_matches="teamSeasonMatches" />

      </v-tab-item>
    </v-tabs-items>
  </v-container>

</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

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
  props: ["id_team", "displayed_team"],
  data() {
    return {
      tabs: null,
      website_menu: false,
      website_eamil: false,
      website_phone: false,
      website_map: false
    };
  },
  created() {},
  beforeMount() {},

  mounted() {
    this.setToolBarInfo();
  },

  beforeDestroy() {},

  computed: {
    ...mapState([
      "team_players",
      "league_matches",
      "league_teams",
      "team_football_org"
    ]),
    clubColorStyle() {
      var cur_color = "transparent";
      if (this.currentTeam.clubColors) {
        var first_color = this.currentTeam.clubColors.split("/")[0];
        cur_color = first_color;
      }
      return { "background-color": cur_color };
    },
    currentTeam() {
      return (
        this.displayed_team ||
        this.league_teams.teams.find(obj => obj.id == this.id_team)
      );
    },
    teamSeasonMatches() {
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
    ...mapActions([
      "fetchPlayers",
      "fetchStanding",
      "fetchTeamInfo" // map `this.fetchPlayers(teamStringSearchQuery)` to `this.$store.dispatch('fetchPlayers')`
    ]),
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

<style scoped>
</style>
