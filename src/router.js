import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Matches from "./views/Matches.vue";
import MatchInfo from "./views/MatchInfo.vue";
import TeamInfo from "./views/TeamInfo.vue";
import PlayerInfo from "./views/PlayerInfo.vue";
Vue.use(Router);

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    // scroll to anchor by returning the selector
    console.log(to);
    if (to.name === "competition") {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          var el = document.querySelector(".scroll_target");

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
        }, 800);
      });
    }
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/competition/:id_competition",
      name: "competition",
      component: Matches,
      props: true
    },
    {
      path: "/match/:id_match",
      name: "matchinfo",
      component: MatchInfo,
      props: true
    },
    {
      path: "/team/:id_team",
      name: "teaminfo",
      component: TeamInfo,
      props: true
    },
    {
      path: "/team/:id_team/player/:id_player",
      name: "playerinfo",
      component: PlayerInfo,
      props: true
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
