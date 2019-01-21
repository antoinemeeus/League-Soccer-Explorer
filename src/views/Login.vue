<template>
  <v-container>
    <v-layout
      column
      justify-center
    >
      Please log in with you google account to continue
      <v-btn
        :loading="loadingUser"
        :disabled="loadingUser"
        @click="login"
      >
        Sign in with google
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "Login",
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapState(["loadingUser"])
  },
  methods: {
    ...mapActions(["userLogIn"]),
    login() {
      this.userLogIn();
      // var provider = new firebase.auth.GoogleAuthProvider();
      // provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      // //Sign in with pop up
      // firebase
      //   .auth()
      //   .signInWithPopup(provider)
      //   .then(result => {
      //     // This gives you a Google Access Token. You can use it to access the Google API.
      //     var token = result.credential.accessToken;
      //     // The signed-in user info.
      //     var user = result.user;
      //     //this.$store.commit("SET_USER", user);
      //     // ...
      //     console.log("Correctly logged in!!");
      //     this.$router.push("/");
      //   })
      //   .catch(function(error) {
      //     // Handle Errors here.
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     // The email of the user's account used.
      //     console.error("ERROR!");
      //     console.error(errorMessage);
      //     var email = error.email;
      //     // The firebase.auth.AuthCredential type that was used.
      //     var credential = error.credential;
      //     // ...
      //   });
    }
  }
};
</script>

<style>
</style>
