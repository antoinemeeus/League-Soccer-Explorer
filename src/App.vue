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
        <v-flex>
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
      <v-list>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon right>mdi-trophy</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Leagues</v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/chat">
          <v-list-tile-action>
            <v-icon right>chat</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Chat</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon right>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Search</v-list-tile-title>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar
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

    <v-content v-if="!loadingData">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
    <!-- Loader -->
    <v-dialog
      v-model="loadingData"
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
    <!-- Loader -->
    <!-- <v-footer
      fixed
      height="40"
      app
    >
      <v-layout justify-space-around>
        <v-btn
          :disabled="!leagueSelected"
          color="teal"
          flat
          to="/about"
        >
          <v-icon>mdi-trophy</v-icon>
        </v-btn>

        <v-btn
          color="teal"
          flat
          to="/"
        >
          <v-icon>home</v-icon>
        </v-btn>

        <v-btn
          color="teal"
          flat
          to="/chat"
        >
          <v-icon>chat</v-icon>
        </v-btn>
      </v-layout>
    </v-footer> -->
  </v-app>
</template>

<script>
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
      "fetchPlayers", // map `this.fetchPlayers(teamStringSearchQuery)` to `this.$store.dispatch('fetchPlayers')`
      "fetchTeamInfo"
    ]),

    setTitle(str) {
      this.$store.commit("SET_TITLE", str);
    },
    setIcon(newSrc) {
      this.$store.commit("SET_ICON", newSrc);
    },
    goToCompetition() {
      if (this.$route.name != "home")
        this.$router.push(`/competition/${currentLeague.id}`);
    },
    getYearFromDate(strDate) {
      var d = new Date(strDate);
      return d.getFullYear();
    },
    currentSeasonYears(seasonObj) {
      return (
        this.getYearFromDate(seasonObj.startDate) +
        "-" +
        this.getYearFromDate(seasonObj.endDate)
      );
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
    }
  },
  computed: {
    ...mapState([
      "loadingData",
      "currentLeague",
      "app_title",
      "league_icon",
      "league_matches"
    ]),
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
    this.getCorrespondingRouteData();
    this.seasonTitle = this.currentSeasonYears(
      this.league_matches.matches[0].season
    );
    this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
    this.$store.commit("SET_LEAGUE_ICON", "Home");
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
      if (to.name == "competition") {
      }
    }
  }
};
</script>
