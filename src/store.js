import Vue from "vue";
import Vuex from "vuex";

import TempCompetition from "./assets/Competitions.json";
import LeagueMatches from "./assets/Matches_2021.json";
import LeagueTeams from "./assets/Teams_2021.json";
import LeagueMatchesInfo from "./assets/MatchesInfo_2021.json";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    league_icon: "Home",
    app_title: "",
    league_competition: TempCompetition,
    league_matches: LeagueMatches,
    league_matches_info: LeagueMatchesInfo,
    league_teams: LeagueTeams
  },
  mutations: {
    SET_LEAGUE_ICON(state, payload) {
      state.league_icon = payload;
    },
    SET_APP_TITLE(state, payload) {
      state.app_title = payload;
    }
  },
  actions: {}
});
