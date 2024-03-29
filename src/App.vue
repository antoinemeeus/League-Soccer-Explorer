<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      clipped
      width="220"
    >
      <v-layout
        column
        py-3
        justify-center
        align-center
      >
        <v-flex text-xs-center>
          <h2>{{ app_title }}</h2>
        </v-flex>
        <v-avatar size="80">
          <v-img
            :src="
              require(`@/assets/leagues_logo/league_${league_icon}.png`)
            "
            contain
          />
        </v-avatar>
      </v-layout>

      <v-list px-2>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>mdi-trophy</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Leagues</v-list-tile-title>
        </v-list-tile>

        <v-list-tile to="/chat">
          <v-list-tile-action>
            <v-icon>chat</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Chat</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          v-if="!isAuthenticated"
          @click="logIn"
        >
          <v-list-tile-action>
            <v-icon :style="{ cursor: 'pointer' }">
              account_circle
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Log In</v-list-tile-title>
        </v-list-tile>

        <v-list-group
          v-if="isAuthenticated"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-avatar size="25">
                <v-img :src="user.photoURL" />
              </v-avatar>
            </v-list-tile-action>
            <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="logOut">
            <v-list-tile-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      ref="ref_toolbar"
      fixed
      clipped-left
      app
      tabs
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-toolbar-title
        :style="{ cursor: 'pointer' }"
        class="px-2 text-xs-center "
        @click="goToCompetition"
      >
        <h2 class="subheading">
          {{ app_title }}
        </h2>
      </v-toolbar-title>
      <v-spacer />
      <v-img
        class="pr-2"
        :src="require(`@/assets/leagues_logo/league_${league_icon}.png`)"
        contain
        max-height="50"
        min-height="40"
      />

      <v-layout
        slot="extension"
        align-center
      >
        <v-flex xs2>
          <v-icon
            v-if="goBackButton"
            :style="{ cursor: 'pointer' }"
            icon
            @click="$router.go(-1)"
          >
            arrow_back
          </v-icon>
        </v-flex>
        <v-flex
          xs8
          text-xs-center
          class="title text-capitalize"
        >
          {{ SearchView }}
        </v-flex>
        <v-flex
          xs2
          text-xs-right
        >
          <v-icon
            v-if="$route.name === 'competition'"
            :style="{ cursor: 'pointer' }"
            @click="$store.commit('goToCurrentMut')"
          >
            vertical_align_center
          </v-icon>
        </v-flex>
      </v-layout>
    </v-toolbar>

    <v-content>
      <v-fade-transition mode="out-in">
        <router-view
          v-if="
            !loadingMatches &&
              !loadingTeams &&
              !loadingStandings &&
              !loadingTeamInfo
          "
        />
      </v-fade-transition>
    </v-content>
    <!-- Loader -->
    <v-dialog
      :value="
        localLoading ||
          loadingPlayers ||
          loadingLeague ||
          loadingTeams ||
          loadingMatches ||
          loadingTeamInfo
      "
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="grey--darken-1"
        dark
      >
        <v-layout
          pa-3
          column
          justify-content-center
          align-center
        >
          <v-flex>
            Loading...
          </v-flex>
          <v-progress-circular
            :size="70"
            :width="7"
            color="red"
            indeterminate
          />
        </v-layout>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "App",
  components: {},
  data() {
    return {
      drawer: false,
      seasonTitle: "",
      localLoading: false
    };
  },
  computed: {
    ...mapState([
      "user",
      "loadingLeague",
      "loadingTeams",
      "loadingMatches",
      "loadingStandings",
      "loadingPlayers",
      "loadingTeamInfo",
      "currentLeague",
      "app_title",
      "league_icon",
      "league_matches"
    ]),
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    goBackButton() {
      return this.$route.name !== "home";
    },
    SearchView() {
      return this.$route.name;
    }
  },
  watch: {
    $route(to, from) {
      if (to.name !== "matchinfo" || from.name !== "matchinfo") {
        this.routeGetSetData(to);
      }
    }
  },
  created() {
    this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
    this.$store.commit("SET_LEAGUE_ICON", "Home");
    //Check route at created moment.

    console.log("We are refreshing on the " + this.$route.name + " page");
    console.log(this.$route);
    this.routeGetSetData(this.$route);
  },
  methods: {
    ...mapActions(["fetchAPI", "fetchPlayers"]),
    logOut() {
      this.$store.dispatch("userLogOut");
      this.drawer = false;
      this.$router.push("/");
    },
    logIn() {
      //this.drawer = false;
      this.$router.push({
        name: "login",
        query: {from: this.$route.fullPath}
      });
      //this.$router.push("/login");
    },
    setTitle(str) {
      this.$store.commit("SET_TITLE", str);
    },
    setIcon(newSrc) {
      this.$store.commit("SET_ICON", newSrc);
    },
    goToCompetition() {
      if (this.$route.name !== "home")
        this.$router.push(`/competition/${this.currentLeague.id}`);
    },

    routeGetSetData(route_) {
      //Important method that will decide the fetching logic and data required in function to the route name/path and parameters.
      this.localLoading = true;

      if (route_.name === "home") {
        console.log("We are in home");
        this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
        this.$store.commit("SET_LEAGUE_ICON", "Home");
        this.$store.commit("SET_CURRENT_LEAGUE", {name: "Home", id: ""});
        if (this.$store.state.league_competition) {
          //If league is already in store, don't fetch it again.
          console.log("League is already in store");
        } else {
          console.log("League is not in store");
          this.fetchAPI({key: "getLeagues", query: "?plan=TIER_ONE"});
        }
      }
      if (route_.name === "competition" || route_.name === "matchinfo") {
        let cur_id_competition = route_.params.idCompetition;
        if (
          this.$store.state.league_matches &&
          this.$store.state.league_matches.competition.id === cur_id_competition
        ) {
          console.log("League_matches is already in store");
        } else {
          console.log("Fetching league_matches required to render component: ");
          this.fetchAPI({key: "getMatches", query: cur_id_competition});
        }
        if (
          this.$store.state.league_teams &&
          this.$store.state.league_teams.competition.id === cur_id_competition
        ) {
          console.log("League_teams is already in store");
        } else {
          console.log("Fetching league_teams required to render component: ");
          this.fetchAPI({key: "getTeams", query: cur_id_competition});
        }
      }
      if (route_.name === "teaminfo") {
        let cur_id_competition = route_.params.idCompetition;
        let cur_id_team = route_.params.idTeam;
        if (
          this.$store.state.team_football_org &&
          this.$store.state.team_football_org.id === cur_id_team
        ) {
          console.log("League_teamInfo is already in store");
        } else {
          console.log("League_teamInfo required to render component:");
          this.$store.commit("SET_CURRENT_TEAM_ID", null);
          this.fetchAPI({key: "getPlayers", query: cur_id_team});
        }
        if (
          this.$store.state.league_matches &&
          this.$store.state.league_matches.competition.id === cur_id_competition
        ) {
          console.log("League_matches is already in store");
        } else {
          console.log("Fetching league_matches required to render component: ");
          this.fetchAPI({key: "getMatches", query: cur_id_competition});
        }

        if (
          this.$store.state.league_teams &&
          this.$store.state.league_teams.competition.id === cur_id_competition
        ) {
          console.log("League_teams is already in store");
        } else {
          console.log("Fetching league_teams required to render component: ");
          this.fetchAPI({key: "getTeams", query: cur_id_competition});
        }

        if (
          this.$store.state.league_standings &&
          this.$store.state.league_standings.competition.id === cur_id_competition
        ) {
          console.log("League_standings is already in store");
        } else {
          console.log(
            "Fetching league_standings required to render component: "
          );
          this.fetchAPI({key: "getStandings", query: cur_id_competition});
        }
      }
      this.localLoading = false;
    }
  }
};
</script>
