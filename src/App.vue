<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      width="220"
    >
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Search</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar
      fixed
      clipped-left
      app
      color="indigo"
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="px-2 text-xs-center ">
        <h2 class="subheading">{{appTitle}}</h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img
        class="pr-2"
        :src="require(`@/assets/leagues_logo/league_${this.league_icon}.png`)"
        contain
        max-height="50"
        min-height="40"
      />
      <v-layout
        slot="extension"
        align-center
      >
        <v-flex xs4>
          <v-btn
            v-if="goBackButton"
            icon
            @click="$router.go(-1)"
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <h4> Season: {{seasonTitle}}</h4>
          <h4> {{pageTitle}} </h4>
        </v-flex>
      </v-layout>
    </v-toolbar>

    <v-content>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>

    <v-footer
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
        >
          <v-icon>chat</v-icon>
        </v-btn>
      </v-layout>
    </v-footer>
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
      //toolBarIcon: "",
      appTitle: "",
      seasonTitle: "",
      pageTitle: ""
    };
  },
  methods: {
    ...mapActions([
      "fetchPlayers", // map `this.fetchPlayers(teamStringSearchQuery)` to `this.$store.dispatch('fetchPlayers')`
      "fetchTeamInfo"
    ]),
    setTitle(str) {
      this.$store.commit("SET_TITLE", str);
    },
    setIcon(newSrc) {
      this.$store.commit("SET_ICON", newSrc);
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
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    sendLeagueInfoStore() {
      this.$store.commit("SET_LEAGUE_ICON", this.league_properties.code);
      this.$store.commit("SET_APP_TITLE", this.league_properties.name);
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
    ...mapState(["app_title", "league_icon", "league_matches"]),
    leagueSelected() {
      //console.log(this.$router.app._route.name);
      if (this.$router.app._route.name == "home") return false;
      return true;
    },
    goBackButton() {
      return this.$router.app._route.name != "home";
    }
  },
  created() {
    this.getCorrespondingRouteData();
    this.appTitle = "League Soccer Explorer";
    this.pageTitle = "Leagues And Cups";
    // this.toolBarIcon = "Home";
    this.seasonTitle = this.currentSeasonYears(
      this.league_matches.matches[0].season
    );
  },

  watch: {
    $route(to, from) {
      console.log("Route Was Changed!!!");
      this.getCorrespondingRouteData();
      this.appTitle = this.app_title;
      this.pageTitle = this.capitalizeFirstLetter(to.name);

      if (to.name == "home") {
        console.log("We are in home");
        this.appTitle = "Leagues And Cups";
        this.$store.commit("SET_LEAGUE_ICON", "Home");
      }

      //this.toolBarIcon = this.league_icon;
    }
  }
};
</script>
