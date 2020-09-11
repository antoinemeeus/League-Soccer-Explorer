import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Home from "./views/Home.vue";
import MatchesList from "./views/MatchesList.vue";
import MatchInfo from "./views/MatchInfo.vue";
import TeamInfo from "./views/TeamInfo.vue";
import PlayerInfo from "./views/PlayerInfo.vue";
import ChatRoom from "./views/ChatRoom.vue";
import Login from "./views/Login.vue";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

const router = new Router({
    mode: "history",
    scrollBehavior(to) {
        // scroll to anchor by returning the selector
        if (to.name === "competition") {
            return new Promise(resolve => {
                setTimeout(() => {
                    var el = document.querySelector(".scroll_target");
                    if (el) {
                        var rect = el.getBoundingClientRect(),
                            scrollLeft =
                                window.pageXOffset || document.documentElement.scrollLeft,
                            scrollTop =
                                window.pageYOffset || document.documentElement.scrollTop;
                        var halfViewportHeight = window.innerHeight / 2;

                        resolve({
                            x: rect.left + scrollLeft,
                            y: rect.top + scrollTop - halfViewportHeight
                        });
                    } else {
                        resolve({
                            x: 0,
                            y: 0
                        });
                    }
                }, 1200);
            });
        }
        return {x: 0, y: 0};
    },
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/competition/:id_competition",
            name: "competition",
            component: MatchesList,
            props: true
        },
        {
            path: "/competition/:id_competition/match/:id_match",
            name: "matchinfo",
            component: MatchInfo,
            props: true
        },
        {
            path: "/competition/:id_competition/team/:id_team",
            name: "teaminfo",
            component: TeamInfo,
            props: true
        },
        {
            path: "/competition/:id_competition/team/:id_team/player/:id_player",
            name: "playerinfo",
            component: PlayerInfo,
            props: true
        },
        {
            path: "/chat",
            name: "chatroom",
            component: ChatRoom,
            meta: {requiresAuth: true}
        },
        {path: "*", component: NotFound}
    ]
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = firebase.auth().currentUser;
    if (requiresAuth && !isAuthenticated) {
        next({name: "login", query: {from: to.path}});
    } else {
        next();
    }
});

export default router;
