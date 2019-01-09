import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Matches from "./views/Matches.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/competition/:id",
      name: "competition",
      component: Matches,
      props: true,
      children: [
        {
          // About will be rendered inside Matches's <router-view>
          // when /user/:id/profile is matched
          path: "match",
          component: () =>
            import(/* webpackChunkName: "about" */ "./views/About.vue")
        }
      ]
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
