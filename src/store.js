import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router";

import {getAuth, GoogleAuthProvider} from "firebase/auth";
import LeagueMatchesInfo_2021 from "./assets/MatchesInfo_2021.json";
import LeagueMatchesInfo_2014 from "./assets/MatchesInfo_2014.json";
import LeagueMatchesInfo_2019 from "./assets/MatchesInfo_2019.json";
import LeagueMatchesInfo_2002 from "./assets/MatchesInfo_2002.json";


Vue.use(Vuex);

Vue.use(VueAxios, axios);


export default new Vuex.Store({
    state: {
        user: null,
        error: null,
        loadingUser: false,
        minutesUpdate: 20,
        API_URL: "https://api.football-data.org/v2/",
        options: {
            headers: {
                "X-Auth-Token": process.env.VUE_APP_API_TOKEN,
                "Origin": "http://localhost:8081",
            }
        },
        urlKeys: {
            getLeagues: {
                str1: "competitions",
                str2: "",
                commitCmd: "SET_COMPETITION",
                commitloadingFlag: "SET_LOADING_LEAGUE"
            },
            getMatches: {
                str1: "competitions/",
                str2: "/matches",
                commitCmd: "SET_MATCHES",
                commitloadingFlag: "SET_LOADING_MATCHES"
            },
            getTeams: {
                str1: "competitions/",
                str2: "/teams",
                commitCmd: "SET_TEAMS",
                commitloadingFlag: "SET_LOADING_TEAMS"
            },
            getStandings: {
                str1: "competitions/",
                str2: "/standings",
                commitCmd: "SET_STANDING",
                commitloadingFlag: "SET_LOADING_STANDING"
            },
            getPlayers: {
                str1: "teams/",
                str2: "",
                commitCmd: "SET_TEAM_SQUAD",
                commitloadingFlag: "SET_LOADING_TEAMINFO"
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
        league_competition: {},
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
        SET_LOADING_LEAGUE(state, payload) {
            state.loadingLeague = payload;
        },
        SET_LOADING_MATCHES(state, payload) {
            state.loadingMatches = payload;
        },
        SET_LOADING_TEAMS(state, payload) {
            state.loadingTeams = payload;
        },
        SET_LOADING_PLAYERS(state, payload) {
            state.loadingPlayers = payload;
        },
        SET_LOADING_TEAMINFO(state, payload) {
            state.loadingTeamInfo = payload;
        },
        SET_LOADING_STANDING(state, payload) {
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
        userSignUp({commit}, payload) {
            commit("setLoadingUser", true);
            getAuth()
                .createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    commit("setUser", {email: firebaseUser.user.email});
                    commit("setLoadingUser", false);
                    router.push("/");
                })
                .catch(error => {
                    commit("setError", error.message);
                    commit("setLoadingUser", false);
                });
        },
        autoLogIn({commit}, payload) {
            commit("setUser", payload);
        },
        userLogIn({commit}) {
            commit("setLoadingUser", true);
            const provider = new GoogleAuthProvider();
            provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
            //Sign in with pop up
            getAuth()
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
                .catch(function (error) {
                    // Handle Errors here.
                    let errorMessage = error.message;
                    // The email of the user's account used.
                    console.error("ERROR!");
                    console.error(errorMessage);
                    commit("setLoadingUser", false);
                });
        },
        userLogOut({commit}) {
            getAuth()
                .signOut()
                .then(function () {
                    // Sign-out successful.
                    console.log("Successfully log out");
                })
                .catch(function (error) {
                    // An error happened.;
                    console.error(error);
                });
            commit("setUser", null);
        },
        fetchAPI({commit, state}, params) {
            let fetchOptions = state.urlKeys[params.key];
            let StorageKey = fetchOptions.str1 + params.query + fetchOptions.str2;
            commit(fetchOptions.commitloadingFlag, true);
            let now = new Date();
            let lastFetched = new Date(
                JSON.parse(localStorage.getItem(StorageKey + "_savedTime"))
            );
            let timePassedInMinutes = Math.abs(now - lastFetched) / (1000 * 60);
            if (timePassedInMinutes < state.minutesUpdate) {
                let savedLocalData = JSON.parse(localStorage.getItem(StorageKey));
                if (savedLocalData) {
                    commit(fetchOptions.commitCmd, savedLocalData);
                    commit(fetchOptions.commitloadingFlag, false);
                    return;
                }
            }

            let requestURL =
                state.API_URL + fetchOptions.str1 + params.query + fetchOptions.str2;
            axios
                .get(requestURL, state.options)
                .then(response => response.data)
                .then(dataJSON => {
                    commit(fetchOptions.commitCmd, dataJSON);
                    commit(fetchOptions.commitloadingFlag, false);
                    localStorage.setItem(StorageKey, JSON.stringify(dataJSON));
                    localStorage.setItem(
                        StorageKey + "_savedTime",
                        JSON.stringify(new Date())
                    );
                })
                .catch(err => {
                    console.log(err);
                    commit(fetchOptions.commitloadingFlag, false);
                    commit(fetchOptions.commitCmd, "{}");
                });
        },
        fetchPlayers({commit, dispatch}, {string_query, retryCount}) {
            if (typeof retryCount === "undefined") {
                retryCount = 0;
            }
            commit("SET_LOADING_PLAYERS", true);
            commit("SET_TEAM_PLAYERS", []);
            axios
                .get(
                    "https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?t=" +
                    string_query
                )
                .then(response => response.data)
                .then(players => {
                    if (players.player == null) {
                        let newTeamName = string_query.split(" ")[0];

                        if (retryCount === 1) {
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
                    commit("SET_CURRENT_TEAM_ID", players.player[0].id_team);
                    commit("SET_LOADING_PLAYERS", false);
                })
                .catch(err => console.log(err));
        }
    }
});
