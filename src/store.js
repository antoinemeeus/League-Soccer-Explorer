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
    urlKeys: {
      league_competition: "competitions?plan=TIER_ONE",
      league_matches: "",
      league_matches_info: "",
      league_teams: "",
      league_standings: "",
      team_football_org: "",
      team_players: ""
    },

    loadingData: false,

    league_icon: "Home",
    app_title: "",
    currentLeague: {},
    historyCount: 1,

    league_competition: {
      count: null,
      filters: {
        plan: ""
      },
      competitions: []
    },
    league_matches: LeagueMatches,
    league_matches_info: LeagueMatchesInfo,
    league_teams: LeagueTeams,
    league_standings: LeagueStanding,
    team_info: [],

    team_football_org: [],
    team_players: []
  },
  mutations: {
    SET_CURRENT_LEAGUE(state, payload) {
      state.currentLeague = payload;
    },
    SET_LEAGUE_ICON(state, payload) {
      state.league_icon = payload;
    },
    SET_COMPETITION(state, payload) {
      state.league_competition = payload;
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
    },
    SET_HISTORY_COUNTER(state, payload) {
      state.historyCount = payload;
    },
    ADD_HISTORY_COUNTER(state) {
      state.historyCount += 1;
    }
  },
  actions: {
    fetchLeague({ commit, state }, key) {
      commit("SET_LOADING", true);
      //Check last update in competitions and fetch data if last update is superior to 6hrs.
      var fetchFlag = true;
      var nowDate = new Date();
      var Storagekey = key;

      var lastDataStored = JSON.parse(localStorage.getItem(Storagekey));
      var minutesSinceLastSave = 180;
      var minutesSinceLastUpdate = 180;
      if (lastDataStored) {
        console.log("There is data in storage:");
        var array = lastDataStored.competitions;
        var lastUpdateDate = new Date(
          Math.max.apply(
            null,
            array.map(function(e) {
              return new Date(e.lastUpdated);
            })
          )
        );
        console.log(lastUpdateDate);

        minutesSinceLastUpdate =
          Math.abs(nowDate - lastUpdateDate) / (1000 * 60);

        console.log("Minutes since lastUpdate: ", minutesSinceLastUpdate);
        console.log("LastStored: ", lastDataStored.fetchLastDate);

        var lastSavedDate = new Date(lastDataStored.fetchLastDate);
        minutesSinceLastSave = Math.abs(nowDate - lastSavedDate) / (1000 * 60);
        console.log("Minutes since lastSaved: ", minutesSinceLastSave);
        if (minutesSinceLastSave < 10) {
          console.log(
            "Leagues Data is up to date and in memory, no fetching required"
          );
          commit("SET_COMPETITION", lastDataStored);
          commit("SET_LOADING", false);
          fetchFlag = false;
        } else {
          fetchFlag = true;
        }
      }
      console.log("Need fetch? ", fetchFlag);
      if (minutesSinceLastUpdate > 120 && fetchFlag) {
        console.log("Fechting Competitions data from football data org:");
        axios
          .get(
            "http://api.football-data.org/v2/" + state.urlKeys[key],
            state.options
          )
          .then(response => response.data)
          .then(leagues => {
            commit("SET_LOADING", false);
            leagues["fetchLastDate"] = nowDate;
            commit("SET_COMPETITION", leagues);
            localStorage.setItem(Storagekey, JSON.stringify(leagues));
          })
          .catch(err => console.log(err));
      }
    },

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

            if (retryCount < 3)
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
