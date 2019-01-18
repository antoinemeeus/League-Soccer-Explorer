import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import * as directives from "vuetify/es5/directives";

Vue.use(Vuetify, {
  iconfont: "mdi", //md
  directives
});
