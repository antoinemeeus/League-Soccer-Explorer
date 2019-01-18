import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex);

Vue.use(VueAxios, axios);

import TempCompetition from "./assets/Competitions.json";
import LeagueMatches from "./assets/Matches_2021.json";
import LeagueTeams from "./assets/Teams_2021.json";
import LeagueMatchesInfo from "./assets/MatchesInfo_2021.json";
import LeagueStanding from "./assets/Standing_2021.json";

export default new Vuex.Store({
  state: {
    options: {
      headers: { "X-Auth-Token": "018c8c34753848cab1551ae2ecd62ee1" }
    },

    loadingData: false,

    league_icon: "Home",
    app_title: "",

    league_competition: TempCompetition,
    league_matches: LeagueMatches,
    league_matches_info: LeagueMatchesInfo,
    league_teams: LeagueTeams,
    league_standings: LeagueStanding,
    team_info: [],

    team_football_org: [],
    team_players: []
  },
  mutations: {
    SET_LEAGUE_ICON(state, payload) {
      state.league_icon = payload;
    },
    SET_APP_TITLE(state, payload) {
      state.app_title = payload;
    },
    SET_LOADING(state, payload) {
      state.loadingData = payload;
    },
    SET_TEAM_PLAYERS(state, payload) {
      state.team_players = payload;
    },
    SET_TEAM_SQUAD(state, payload) {
      state.team_football_org = payload;
    }
  },
  actions: {
    fetchLeague({ commit }, data_org_url) {},

    fetchMatches({ commit }, leagueId) {},

    fetchTeamInfo({ commit, state }, teamId) {
      commit("SET_LOADING", true);
      console.log(
        "Fechting Players data from team and football data org: " + teamId
      );
      axios
        .get("http://api.football-data.org/v2/teams/" + teamId, state.options)
        .then(response => response.data)
        .then(team => {
          commit("SET_LOADING", false);
          commit("SET_TEAM_SQUAD", team);
        })
        .catch(err => console.log(err));
    },
    fetchPlayers({ commit, dispatch }, { string_query, retryCount }) {
      console.log("Count actual:", retryCount);
      if (typeof retryCount === "undefined") {
        retryCount = 0;
        console.log("Count to zero:", retryCount);
      }

      commit("SET_LOADING", true);
      commit("SET_TEAM_PLAYERS", []);
      axios
        .get(
          "https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?t=" +
            string_query
        )
        .then(response => response.data)
        .then(players => {
          //console.log(players);
          if (players.player == null) {
            console.log(
              "Failed to catch players with team named: " + string_query
            );
            var newTeamName = string_query.split(" ")[0];

            if (retryCount == 1) {
              newTeamName = string_query.substring(0, 3);
            }
            retryCount++;
            console.log("Retry number: " + retryCount);
            console.log("Trying with: " + newTeamName);

            if (retryCount < 2)
              dispatch("fetchPlayers", {
                string_query: newTeamName,
                retryCount: retryCount
              });
            else console.log("Too many retries");
          }
          commit("SET_LOADING", false);
          commit("SET_TEAM_PLAYERS", players.player);
        })
        .catch(err => console.log(err));
    }
  }
});
