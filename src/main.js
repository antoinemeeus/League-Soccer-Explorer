import Vue from "vue";
import "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
//Firebase init
import firebase from "firebase";

Vue.prototype.moment = moment;

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

console.log("API KEY:" + config.apiKey);
console.log(process.env.VUE_APP_FIRESTORE_TOKEN);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

window.db = db;

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
    new Vue({
        el: "#app",
        router,
        store,
        created() {
            if (firebaseUser) {
                store.dispatch("autoLogIn", firebaseUser);
            }
        },
        render: h => h(App)
    });
    unsubscribe();
});
