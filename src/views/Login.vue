<template>
  <v-container>
    <v-layout
      column
      justify-center
      align-center
    >
      <h2>
        Sign in with :
      </h2>
      <v-flex pa-3>
        <v-btn
          xs6
          :loading="loadingUser"
          :disabled="loadingUser"
          @click="login"
        >

          <v-layout
            row
            align-center
            justify-space-around
          >
            <v-flex pr-3>
              <v-avatar size="30">
                <img src="@/assets/G_logo_64.png">
              </v-avatar>
            </v-flex>

            <v-flex>
              Sign in with google
            </v-flex>

          </v-layout>
        </v-btn>
      </v-flex>
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
    }
  }
};
</script>

<style scoped>
</style>
