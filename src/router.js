import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Matches from "./views/Matches.vue";
import MatchInfo from "./views/MatchInfo.vue";

Vue.use(Router);

export default new Router({
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
