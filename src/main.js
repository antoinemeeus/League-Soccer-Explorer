import Vue from "vue";
import "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import App from "./App.vue";
import router from "./router";
import store from "./store";
import _ from "lodash";
import moment from "moment";
Vue.prototype.moment = moment;

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

window.db = db;

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
  new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    created() {
      if (firebaseUser) {
        store.dispatch("autoLogIn", firebaseUser);
      }
    }
  });
  unsubscribe();
});
