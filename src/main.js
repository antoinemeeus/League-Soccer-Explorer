import Vue from "vue";
import "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
