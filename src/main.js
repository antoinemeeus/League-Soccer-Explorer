import Vue from "vue";
import "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";

Vue.prototype.moment = moment;
Vue.config.productionTip = false;

//Firebase init
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyCXMYKs5xwQxePtAJPKAIcIEb5ud99pQwA",
    authDomain: "soccerleagueexplorer.firebaseapp.com",
    databaseURL: "https://soccerleagueexplorer.firebaseio.com",
    projectId: "soccerleagueexplorer",
    storageBucket: "soccerleagueexplorer.appspot.com",
    messagingSenderId: "441675358824"
};

const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
const db = getFirestore(firebaseApp);

window.db = db;

const auth = getAuth(firebaseApp);
const unsubscribe = onAuthStateChanged(auth,firebaseUser => {
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
