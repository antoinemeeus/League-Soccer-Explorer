import Vue from "vue";
import Vuex from "vuex";

import TempCompetition from "./assets/Competitions.json";
import LeagueMatches from "./assets/Matches_2021.json";
import LeagueTeams from "./assets/Teams_2021.json";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appTitle: "Football League Explorer",
    toolBarIcon: require(`@/assets/leagues_logo/league_Home.png`),

    league_competition: TempCompetition,
    league_matches: LeagueMatches,
    league_teams: LeagueTeams
  },
  mutations: {
    SET_TITLE(state, newTitle) {
      state.appTitle = newTitle;
    },
    SET_ICON(state, newSrc) {
      state.toolBarIcon = require(`@/assets/leagues_logo/league_${newSrc}.png`);
    }
  },
  actions: {}
});
