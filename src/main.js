import Vue from "vue";
import "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import App from "./App.vue";
import router from "./router";
import store from "./store";
import _ from "lodash";

//Firebase init
import firebase from "firebase";
require("firebase/firestore");

var config = {
  apiKey: "AIzaSyCXMYKs5xwQxePtAJPKAIcIEb5ud99pQwA",
  authDomain: "soccerleagueexplorer.firebaseapp.com",
  databaseURL: "https://soccerleagueexplorer.firebaseio.com",
  projectId: "soccerleagueexplorer",
  storageBucket: "soccerleagueexplorer.appspot.com",
  messagingSenderId: "441675358824"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

window.db = db;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
