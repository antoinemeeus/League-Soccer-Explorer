import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import firebase from "firebase";
import router from "./router";

Vue.use(Vuex);

Vue.use(VueAxios, axios);

import LeagueMatchesInfo_2021 from "./assets/MatchesInfo_2021.json";
import LeagueMatchesInfo_2014 from "./assets/MatchesInfo_2014.json";
import LeagueMatchesInfo_2019 from "./assets/MatchesInfo_2019.json";
// import LeagueStanding from "./assets/Standing_2021.json";

export default new Vuex.Store({
  state: {
    user: null,
    error: null,
    loadingUser: false,
    minutesUpdate: 20,
    options: {
      headers: { "X-Auth-Token": "018c8c34753848cab1551ae2ecd62ee1" }
    },
    urlKeys: {
      league_competition: "competitions?plan=TIER_ONE"
    },
    apiLeaguesID: {
      idLeague: "4328",
      strLeague: "English Premier League"
    },

    loadingLeague: false,
    loadingMatches: false,
    loadingTeams: false,
    loadingPlayers: false,
    loadingStandings: false,

    league_icon: "Home",
    app_title: "",
    currentLeague: {},

    league_competition: {
      count: null,
      competitions: []
    },
    league_matches: { count: null, matches: [] },
    league_matches_info: {
      2014: LeagueMatchesInfo_2014,
      2021: LeagueMatchesInfo_2021,
      2019: LeagueMatchesInfo_2019
    },
    league_teams: {
      count: null,
      competition: {},
      season: {},
      teams: []
    },
    league_current_event: {},
    league_standings: null,
    team_info: [],

    team_football_org: [],
    team_players: []
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setLoadingUser(state, payload) {
      state.loadingUser = payload;
    },
    SET_CURRENT_LEAGUE(state, payload) {
      state.currentLeague = payload;
    },
    SET_LEAGUE_ICON(state, payload) {
      state.league_icon = payload;
    },
    SET_COMPETITION(state, payload) {
      state.league_competition = payload;
    },
    SET_MATCHES(state, payload) {
      state.league_matches = payload;
    },
    SET_TEAMS(state, payload) {
      state.league_teams = payload;
    },
    SET_STANDING(state, payload) {
      state.league_standings = payload;
    },
    SET_CURRENT_EVENT(state, payload) {
      state.league_current_event = payload;
    },
    SET_APP_TITLE(state, payload) {
      state.app_title = payload;
    },
    SET_LOADINGLEAGUE(state, payload) {
      state.loadingLeague = payload;
    },
    SET_LOADINGMATCHES(state, payload) {
      state.loadingMatches = payload;
    },
    SET_LOADINGTEAMS(state, payload) {
      state.loadingTeams = payload;
    },
    SET_LOADINGPLAYERS(state, payload) {
      state.loadingPlayers = payload;
    },
    SET_LOADINGSTANDING(state, payload) {
      state.loadingStandings = payload;
    },
    SET_TEAM_PLAYERS(state, payload) {
      state.team_players = payload;
    },
    SET_TEAM_SQUAD(state, payload) {
      state.team_football_org = payload;
    }
  },
  getters: {
    user: state => state.user,
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    }
  },
  actions: {
    userSignUp({ commit }, payload) {
      commit("setLoadingUser", true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          commit("setUser", { email: firebaseUser.user.email });
          commit("setLoadingUser", false);
          router.push("/");
        })
        .catch(error => {
          commit("setError", error.message);
          commit("setLoadingUser", false);
        });
    },
    autoLogIn({ commit }, payload) {
      commit("setUser", payload);
    },
    userLogIn({ commit }) {
      commit("setLoadingUser", true);
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      //Sign in with pop up
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          commit("setUser", result.user);
          commit("setLoadingUser", false);
          console.log("Correctly logged in!!");
          router.push("/");
        })
        .catch(function(error) {
          // Handle Errors here.
          //var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          console.error("ERROR!");
          console.error(errorMessage);
          //var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          //var credential = error.credential;
          commit("setLoadingUser", false);
          // ...
        });
    },
    userLogOut({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
      router.push("/");
    },
    fetchLeague({ commit, state }, key) {
      commit("SET_LOADINGLEAGUE", true);
      //Check last update in competitions and fetch data if last update is superior to 6hrs.
      var fetchFlag = true;
      var nowDate = new Date();
      var Storagekey = key;

      var lastDataStored = JSON.parse(localStorage.getItem(Storagekey));
      var minutesSinceLastSave = 180;
      var minutesSinceLastUpdate = 180;
      if (lastDataStored) {
        console.log("There is League data in storage:");
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
        if (minutesSinceLastSave < state.minutesUpdate) {
          console.log(
            "Leagues Data is up to date and in memory, no fetching required"
          );
          commit("SET_COMPETITION", lastDataStored);
          commit("SET_LOADINGLEAGUE", false);
          fetchFlag = false;
        } else {
          fetchFlag = true;
        }
      }
      console.log("Need fetch? ", fetchFlag);
      if (minutesSinceLastUpdate > 120 || fetchFlag) {
        console.log("Fechting Competitions data from football data org:");
        axios
          .get(
            "http://api.football-data.org/v2/" + state.urlKeys[key],
            state.options
          )
          .then(response => response.data)
          .then(leagues => {
            leagues["fetchLastDate"] = nowDate;
            commit("SET_COMPETITION", leagues);
            commit("SET_LOADINGLEAGUE", false);
            localStorage.setItem(Storagekey, JSON.stringify(leagues));
          })
          .catch(err => console.log(err));
      }
    },

    fetchMatches({ commit, state }, searchString) {
      commit("SET_LOADINGMATCHES", true);
      //Check last update in competitions and fetch data if last update is superior to 6hrs.
      var fetchFlag = true;
      var nowDate = new Date();
      var Storagekey = searchString;

      var lastDataStored = JSON.parse(localStorage.getItem(Storagekey));
      var minutesSinceLastSave = 180;
      var minutesSinceLastUpdate = 180;
      if (lastDataStored) {
        console.log("There is Match data in storage:");
        var array = lastDataStored.matches;
        var lastUpdateDate = new Date(
          Math.max.apply(
            null,
            array.map(function(e) {
              return new Date(e.lastUpdated);
            })
          )
        );
        console.log(nowDate, lastUpdateDate);

        minutesSinceLastUpdate = Math.abs(
          (nowDate - lastUpdateDate) / (1000 * 60)
        );

        console.log("Minutes since lastUpdate: ", minutesSinceLastUpdate);
        console.log("LastStored: ", lastDataStored.fetchLastDate);

        var lastSavedDate = new Date(lastDataStored.fetchLastDate);
        minutesSinceLastSave = Math.abs(nowDate - lastSavedDate) / (1000 * 60);
        console.log("Minutes since lastSaved: ", minutesSinceLastSave);
        if (minutesSinceLastSave < state.minutesUpdate) {
          console.log(
            "Match Data is up to date and in memory, no fetching required"
          );
          commit("SET_MATCHES", lastDataStored);
          commit("SET_LOADINGMATCHES", false);
          fetchFlag = false;
        } else {
          fetchFlag = true;
        }
      }
      console.log("Need fetch? ", fetchFlag);
      if (minutesSinceLastUpdate > 120 || fetchFlag) {
        console.log("Fechting Matches data from football data org:");
        axios
          .get("http://api.football-data.org/v2/" + searchString, state.options)
          .then(response => response.data)
          .then(matches => {
            matches["fetchLastDate"] = nowDate;
            commit("SET_MATCHES", matches);
            commit("SET_LOADINGMATCHES", false);
            localStorage.setItem(Storagekey, JSON.stringify(matches));
          })
          .catch(err => console.log(err));
      }
    },
    fetchStanding({ commit, state }, id_competition) {
      commit("SET_LOADINGSTANDING", true);

      //Check last update in competitions and fetch data if last update is superior to 6hrs.
      var fetchFlag = true;
      var nowDate = new Date();
      var Storagekey = "standings_" + id_competition;

      var lastDataStored = JSON.parse(localStorage.getItem(Storagekey));
      var minutesSinceLastSave = 180;
      var minutesSinceLastUpdate = 180;
      if (lastDataStored) {
        console.log("There is Standing data in storage:");
        var lastUpdateDate = new Date(lastDataStored.competition.lastUpdated);

        console.log(nowDate, lastUpdateDate);

        minutesSinceLastUpdate = Math.abs(
          (nowDate - lastUpdateDate) / (1000 * 60)
        );
        console.log("Minutes since lastUpdate: ", minutesSinceLastUpdate);
        console.log("LastStored: ", lastDataStored.fetchLastDate);

        var lastSavedDate = new Date(lastDataStored.fetchLastDate);
        minutesSinceLastSave = Math.abs(nowDate - lastSavedDate) / (1000 * 60);
        console.log("Minutes since lastSaved: ", minutesSinceLastSave);
        if (minutesSinceLastSave < state.minutesUpdate) {
          console.log(
            "Standing Data is up to date and in memory, no fetching required"
          );

          commit("SET_STANDING", lastDataStored);
          commit("SET_LOADINGSTANDING", false);
          fetchFlag = false;
        } else {
          fetchFlag = true;
        }
      }
      console.log("Need fetch? ", fetchFlag);
      if (minutesSinceLastUpdate > 120 || fetchFlag) {
        console.log("Fechting Matches data from football data org:");
        axios
          .get(
            "http://api.football-data.org/v2/competitions/" +
              id_competition +
              "/standings",
            state.options
          )
          .then(response => response.data)
          .then(standings => {
            standings["fetchLastDate"] = nowDate;
            commit("SET_STANDING", standings);
            commit("SET_LOADINGSTANDING", false);
            localStorage.setItem(Storagekey, JSON.stringify(standings));
          })
          .catch(err => console.log(err));
      }
    },
    fetchEventInfo({ commit }, stringTeamsVs) {
      //commit("SET_LOADING", true);
      console.log("Fechting Current MatchInfo event from: " + stringTeamsVs);
      axios
        .get(
          "https://www.thesportsdb.com/api/v1/json/1/searchevents.php?e=" +
            stringTeamsVs +
            "&s=1819"
        )
        .then(response => response.data)
        .then(event => {
          //commit("SET_LOADING", false);
          commit("SET_CURRENT_EVENT", event);
        })
        .catch(err => console.log(err));
    },
    fetchTeamInfo({ commit, state }, teamId) {
      //commit("SET_LOADING", true);
      console.log(
        "Fechting Players data from team and football data org: " + teamId
      );
      axios
        .get("http://api.football-data.org/v2/teams/" + teamId, state.options)
        .then(response => response.data)
        .then(team => {
          //commit("SET_LOADING", false);
          commit("SET_TEAM_SQUAD", team);
        })
        .catch(err => console.log(err));
    },
    fetchTeams({ commit, state }, searchString) {
      commit("SET_LOADINGTEAMS", true);
      //Check last update in competitions and fetch data if last update is superior to 6hrs.
      var fetchFlag = true;
      var nowDate = new Date();
      var Storagekey = searchString;

      var lastDataStored = JSON.parse(localStorage.getItem(Storagekey));
      var minutesSinceLastSave = 180;
      var minutesSinceLastUpdate = 180;
      if (lastDataStored) {
        console.log("There is Teams data in storage:");
        var array = lastDataStored.teams;
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
        if (minutesSinceLastSave < state.minutesUpdate) {
          console.log(
            "Team Data is up to date and in memory, no fetching required"
          );
          commit("SET_TEAMS", lastDataStored);
          commit("SET_LOADINGTEAMS", false);
          fetchFlag = false;
        } else {
          fetchFlag = true;
        }
      }
      console.log("Need fetch? ", fetchFlag);
      if (minutesSinceLastUpdate > 120 || fetchFlag) {
        console.log("Fechting Team data from football data org:");
        axios
          .get("http://api.football-data.org/v2/" + searchString, state.options)
          .then(response => response.data)
          .then(teams => {
            teams["fetchLastDate"] = nowDate;
            commit("SET_TEAMS", teams);
            commit("SET_LOADINGTEAMS", false);
            localStorage.setItem(Storagekey, JSON.stringify(teams));
          })
          .catch(err => console.log(err));
      }
    },
    fetchPlayers({ commit, dispatch }, { string_query, retryCount }) {
      console.log("Count actual:", retryCount);
      if (typeof retryCount === "undefined") {
        retryCount = 0;
        console.log("Count to zero:", retryCount);
      }

      commit("SET_LOADINGPLAYERS", true);
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
          commit("SET_TEAM_PLAYERS", players.player);
          commit("SET_LOADINGPLAYERS", false);
        })
        .catch(err => console.log(err));
    }
  }
});
