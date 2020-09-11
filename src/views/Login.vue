<template>
  <v-container>
    <v-layout
      align-center
      column
      justify-center
    >
      <h2>
        Sign in with :
      </h2>
      <v-flex pa-3>
        <v-btn
          :disabled="loadingUser"
          :loading="loadingUser"
          xs6
          @click="login"
        >
          <v-layout
            align-center
            justify-space-around
            row
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
import {mapActions, mapState} from "vuex";

export default {
  name: "Login",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["loadingUser"])
  },
  created() {
  },
  methods: {
    ...mapActions(["userLogIn"]),
    login() {
      this.userLogIn();
    }
  }
};
</script>

<style scoped></style>
