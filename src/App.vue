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
        :src="toolBarIcon"
        contain
        max-height="50"
        min-height="40"
      />

    </v-toolbar>

    <v-content>

      <router-view />

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

export default {
  name: "App",
  components: {},
  data() {
    return {
      drawer: null,
      leagueSelected: false
    };
  },
  methods: {
    setTitle(str) {
      this.$store.commit("SET_TITLE", str);
    },
    setIcon(newSrc) {
      this.$store.commit("SET_ICON", newSrc);
    }
  },
  computed: {
    ...mapState(["appTitle", "toolBarIcon"])
  },
  watch: {
    $route(to, from) {
      if (to.name == "home") {
        console.log("Route changed");
        this.setTitle("Football League Explorer");
        this.setIcon("Home");
        this.leagueSelected = false;
      } else this.leagueSelected = true;
    }
  }
};
</script>
