<template>
  <v-app>
    <v-navigation-drawer
      app
      dark
      clipped
      v-model="drawer"
      width="220"
    >
      <v-layout
        column
        py-3
        justify-center
        align-center
      >
        <v-flex text-xs-center>
          <h2>{{app_title}}</h2>
        </v-flex>
        <v-avatar size="80">
          <v-img
            :src="require(`@/assets/leagues_logo/league_${this.league_icon}.png`)"
            contain
          >

          </v-img>
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
            <v-icon>account_circle</v-icon>
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
                <v-img :src="user.photoURL"></v-img>
              </v-avatar>
            </v-list-tile-action>
            <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
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
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title
        @click="goToCompetition"
        class="px-2 text-xs-center "
      >
        <h2 class="subheading">{{app_title}}</h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
            icon
            @click="$router.go(-1)"
          >arrow_back</v-icon>
        </v-flex>
        <v-flex
          xs8
          text-xs-center
          class="title text-capitalize"
        >
          {{SearchView}}
        </v-flex>
        <v-flex xs2></v-flex>
      </v-layout>
    </v-toolbar>

    <v-content v-if="!isLoading">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
    <!-- Loader -->
    <v-dialog
      :value="isLoading"
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
          ></v-progress-circular>
        </v-layout>

      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import firebase from "firebase";
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {},
  data() {
    return {
      drawer: null,
      seasonTitle: ""
    };
  },
  methods: {
    ...mapActions([
      "fetchLeague",
      "fetchMatches",
      "fetchPlayers",
      "fetchTeamInfo"
    ]),
    logOut() {
      this.$store.dispatch("userLogOut");
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
        })
        .catch(function(error) {
          console.log(error);
          alert(error);
          // An error happened.
        });
      //this.$router.push("/");
      this.drawer = false;
    },
    logIn() {
      this.drawer = false;
      this.$router.push("/login");
    },
    setTitle(str) {
      this.$store.commit("SET_TITLE", str);
    },
    setIcon(newSrc) {
      this.$store.commit("SET_ICON", newSrc);
    },
    goToCompetition() {
      if (this.$route.name != "home")
        this.$router.push(`/competition/${this.currentLeague.id}`);
    },

    getCorrespondingRouteData() {
      // console.log(this.$route);
      // console.log(this.$route.name);
      if (this.$route.params.hasOwnProperty("id_team")) {
        console.log("We are in Team info, loading data!!");
        var team_name_query = this.$store.state.league_teams.teams.find(
          obj => obj.id == this.$route.params.id_team
        ).shortName;
        this.fetchPlayers({ string_query: team_name_query });
        this.fetchTeamInfo(this.$route.params.id_team);
      }
      // if (this.$route.params.hasOwnProperty("id_match")) {
      //   console.log("We are in Match Info vue");
      //   // this.fetchTeams("competitions/" + this.id_competition + "/teams");
      //   // this.fetchMatches("competitions/" + this.id_competition + "/matches");
      // }
    }
  },
  computed: {
    ...mapState([
      "user",
      "loadingLeague",
      "loadingTeams",
      "loadingMatches",
      "loadingStandings",
      "currentLeague",
      "app_title",
      "league_icon",
      "league_matches"
    ]),
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isLoading() {
      return (
        this.loadingLeague ||
        this.loadingTeams ||
        this.loadingMatches ||
        this.loadingStandings
      );
    },

    leagueSelected() {
      //console.log(this.$router.app._route.name);
      if (this.$router.app._route.name == "home") return false;
      return true;
    },
    goBackButton() {
      return this.$router.app._route.name != "home";
    },
    SearchView() {
      return this.$route.name;
    }
  },
  created() {
    this.fetchLeague("league_competition");
    this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
    this.$store.commit("SET_LEAGUE_ICON", "Home");
    if (this.$route.params.hasOwnProperty("id_match")) {
      console.log("We are in Match Info vue");
      this.fetchTeams("competitions/" + this.id_competition + "/teams");
      this.fetchMatches("competitions/" + this.id_competition + "/matches");
    }
  },

  watch: {
    $route(to, from) {
      console.log("Route Was Changed!!!");
      this.getCorrespondingRouteData();

      if (to.name == "home") {
        console.log("We are in home");
        this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
        this.$store.commit("SET_LEAGUE_ICON", "Home");
      }
    }
  }
};
</script>
