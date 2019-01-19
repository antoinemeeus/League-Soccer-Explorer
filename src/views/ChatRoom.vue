<template>
  <v-container
    column
    justify-space-between
  >
    <v-layout>
      <v-flex
        id="container"
        :style="`height: ${messageAreaHeight}`"
        class="scroll-y"
        xs12
      >
        This is where messages cards will appear:
        <v-layout
          py-1
          v-for="(msg, index) in arrayOfMessages"
          :key="index"
        >
          <v-card
            color="blue-grey"
            max-width="80%"
          >
            <v-layout>
              <v-flex
                shrink
                px-2
              >
                <v-avatar>
                  <v-img
                    :src="require(`@/assets/CutOutPlaceHolder.jpg`)"
                    contain
                  >
                  </v-img>
                </v-avatar>
              </v-flex>
              <v-layout column>
                <v-flex>
                  {{index}}
                </v-flex>
                <v-flex style="word-break:break-all;">
                  {{msg}}
                </v-flex>
              </v-layout>
            </v-layout>
          </v-card>

        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        ref="textAreaInput"
        xs12
      >
        <v-textarea
          v-model="message"
          @keyup.enter="saveMessage()"
          outline
          autofocus
          counter="300"
          maxlength="300"
          color="deep-purple"
          placeholder="Type your message here..."
          rows="2"
          :append-outer-icon="'mdi-send'"
          @click:append-outer="saveMessage()"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ChatRoom",
  components: {},
  data() {
    return {
      arrayOfMessages: [],
      message: ""
    };
  },
  computed: {
    ...mapState(["league_competition"]),
    messageAreaHeight() {
      var winH = window.innerHeight;
      return winH - 267 + "px";
    }
  },
  methods: {
    saveMessage() {
      if (this.message != "") this.arrayOfMessages.push(this.message);
      console.log(this.message);
      this.message = "";
      console.log(db);
    },
    scrollToEnd() {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    }
  },
  updated: function() {
    this.scrollToEnd();
  }
};
</script>

<style>
</style>
