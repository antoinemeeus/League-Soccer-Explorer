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
import LeagueMatchesInfo_2002 from "./assets/MatchesInfo_2002.json";

export default new Vuex.Store({
  state: {
    user: null,
    error: null,
    loadingUser: false,
    minutesUpdate: 20,
    API_URL: "https://api.football-data.org/v2/",
    options: {
      headers: { "X-Auth-Token": "018c8c34753848cab1551ae2ecd62ee1" }
    },
    urlKeys: {
      getLeagues: {
        str1: "competitions",
        str2: "",
        commitCmd: "SET_COMPETITION",
        commitloadingFlag: "SET_LOADINGLEAGUE"
      },
      getMatches: {
        str1: "competitions/",
        str2: "/matches",
        commitCmd: "SET_MATCHES",
        commitloadingFlag: "SET_LOADINGMATCHES"
      },
      getTeams: {
        str1: "competitions/",
        str2: "/teams",
        commitCmd: "SET_TEAMS",
        commitloadingFlag: "SET_LOADINGTEAMS"
      },
      getStandings: {
        str1: "competitions/",
        str2: "/standings",
        commitCmd: "SET_STANDING",
        commitloadingFlag: "SET_LOADINGSTANDING"
      },
      getPlayers: {
        str1: "teams/",
        str2: "",
        commitCmd: "SET_TEAM_SQUAD",
        commitloadingFlag: "SET_LOADINGTEAMINFO"
      }
    },
    apiLeaguesID: {
      idLeague: "4328",
      strLeague: "English Premier League"
    },
    loadingAPI: false,
    loadingLeague: false,
    loadingMatches: false,
    loadingTeams: false,
    loadingPlayers: false,
    loadingStandings: false,
    loadingTeamInfo: false,

    league_icon: "Home",
    app_title: "",
    currentLeague: null,
    current_team_id: null,
    goToCurrent: false,
    selectedMDay: null,
    league_matches_info: {
      2014: LeagueMatchesInfo_2014,
      2021: LeagueMatchesInfo_2021,
      2019: LeagueMatchesInfo_2019,
      2002: LeagueMatchesInfo_2002
    },
    league_competition: null,
    league_matches: null,
    league_teams: null,
    league_standings: null,
    team_players: [],
    team_football_org: null
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
    goToCurrentMut(state) {
      state.goToCurrent = !state.goToCurrent;
    },
    setSelectedMDay(state, payload) {
      state.selectedMDay = payload;
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
    SET_TEAM_PLAYERS(state, payload) {
      state.team_players = payload;
    },
    SET_TEAM_SQUAD(state, payload) {
      state.team_football_org = payload;
    },

    SET_APP_TITLE(state, payload) {
      state.app_title = payload;
    },
    SET_LOADING(state, payload) {
      state.loadingAPI = payload;
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
    SET_LOADINGTEAMINFO(state, payload) {
      state.loadingTeamInfo = payload;
    },
    SET_LOADINGSTANDING(state, payload) {
      state.loadingStandings = payload;
    },
    SET_CURRENT_TEAM_ID(state, payload) {
      state.current_team_id = payload;
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
          // var token = result.credential.accessToken;
          // The signed-in user info.
          commit("setUser", result.user);
          commit("setLoadingUser", false);
          let _route = router.app._route;
          if (_route.query.from) router.replace(_route.query.from);
          else router.push("/");
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
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          console.log("Successully log out");
        })
        .catch(function(error) {
          // An error happened.;
          console.error(error);
        });
      commit("setUser", null);
      //router.push("/");
    },
    fetchAPI({ commit, state }, params) {
      var fetchOptions = state.urlKeys[params.key];
      var Storagekey = fetchOptions.str1 + params.query + fetchOptions.str2;
      commit(fetchOptions.commitloadingFlag, true);
      let now = new Date();
      let lastFetched = new Date(
        JSON.parse(localStorage.getItem(Storagekey + "_savedTime"))
      );
      let timePassedInMinutes = Math.abs(now - lastFetched) / (1000 * 60);
      if (timePassedInMinutes < state.minutesUpdate) {
        // console.log(
        //   "League update time " +
        //     timePassedInMinutes +
        //     " minutes is less than " +
        //     state.minutesUpdate +
        //     " minutes"
        // );
        // console.log("Trying to load " + params.key + " data from LocalStorage");
        let savedLocalData = JSON.parse(localStorage.getItem(Storagekey));
        if (savedLocalData) {
          // console.log("savedLocalData " + params.key + " is present");
          commit(fetchOptions.commitCmd, savedLocalData);
          commit(fetchOptions.commitloadingFlag, false);
          return;
        } else {
          // console.log("savedLocalData is missing!");
        }
      }

      let requestURL =
        state.API_URL + fetchOptions.str1 + params.query + fetchOptions.str2;
      // console.log("Fechting Data  from football data org:", requestURL);
      axios
        .get(requestURL, state.options)
        .then(response => response.data)
        .then(dataJSON => {
          commit(fetchOptions.commitCmd, dataJSON);
          commit(fetchOptions.commitloadingFlag, false);
          localStorage.setItem(Storagekey, JSON.stringify(dataJSON));
          localStorage.setItem(
            Storagekey + "_savedTime",
            JSON.stringify(new Date())
          );
        })
        .catch(err => {
          console.log(err);
        });
    },

    fetchPlayers({ commit, dispatch }, { string_query, retryCount }) {
      // console.log("Count actual:", retryCount);
      if (typeof retryCount === "undefined") {
        retryCount = 0;
        // console.log("Count to zero:", retryCount);
      }
      // console.log(
      //   "Fetching players from thesportsdb with team name query:",
      //   string_query
      // );
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
            // console.log(
            //   "Failed to catch players with team named: " + string_query
            // );
            var newTeamName = string_query.split(" ")[0];

            if (retryCount == 1) {
              newTeamName = string_query.substring(0, 3);
            }
            retryCount++;

            if (retryCount < 3)
              dispatch("fetchPlayers", {
                string_query: newTeamName,
                retryCount: retryCount
              });
          }
          commit("SET_TEAM_PLAYERS", players.player);
          commit("SET_CURRENT_TEAM_ID", players.player[0].idTeam);
          commit("SET_LOADINGPLAYERS", false);
        })
        .catch(err => console.log(err));
    }
  }
});
