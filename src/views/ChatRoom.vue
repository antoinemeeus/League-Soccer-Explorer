<template>
  <v-container
    py-0
    my-0
    column
    justify-space-between
    class="no_scroll"
    v-resize="onResize"
  >
    <v-layout>
      <v-flex
        id="container"
        :style="`height: ${messageAreaHeight}`"
        class="scroll-y"
        xs12
      >
        <v-layout
          py-2
          column
          v-for="(msg, index) in arrayOfMessages"
          :key="index"
        >

          <v-layout
            :class="{'last-msg':index===arrayOfMessages.length-1}"
            pb-1
            :justify-end="msg.displayName===authUser.displayName"
            widht="70%"
          >
            <v-flex
              align-self-start
              shrink
              :order-xs2="msg.displayName===authUser.displayName"
            >
              <v-avatar size="35">
                <v-img
                  :src="msg.photoURL"
                  contain
                >
                </v-img>
              </v-avatar>
            </v-flex>
            <v-flex
              shrink
              px-1
              :order-xs1="msg.displayName===authUser.displayName"
            >
              <v-card
                class="rounded"
                min-width="120"
                max-width="250"
              >

                <v-layout column>
                  <v-flex
                    px-1
                    pb-1
                  >
                    <div
                      class="blue--text subheading"
                      :class="[msg.displayName===authUser.displayName ? 'text-xs-right' : '']"
                    >{{msg.displayName}}</div>
                  </v-flex>
                  <div pa-1>
                    <v-flex
                      px-1
                      style="word-break:break-word;"
                    >
                      <div>
                        {{msg.message}}
                      </div>
                    </v-flex>
                  </div>
                  <v-flex px-2>
                    <div class="grey--text caption text-xs-right">{{ moment(msg.createdAt).from(new Date())}}</div>
                  </v-flex>

                </v-layout>

              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
      <div style="position: relative">
        <v-btn
          class="btn-positioning"
          @click="scrollToEndWithTransition"
          max="20"
          color="blue"
          absolute
          small
          bottom
          right
          dark
        >
          <v-icon>keyboard_arrow_down</v-icon>
        </v-btn>
      </div>
    </v-layout>

    <v-layout
      id="text-Area"
      ref="textAreaInput"
      pt-1
    >

      <v-flex
        xs12
        ref="bottomChat"
      >

        <v-textarea
          v-resize="onResize"
          v-model="message"
          @keyup.enter="saveMessage()"
          auto-grow
          :rows="texAreaRows"
          autofocus
          counter="300"
          maxlength="300"
          color="blue-grey"
          placeholder="Type your message here..."
          :append-outer-icon="'mdi-send'"
          @click:append-outer="saveMessage()"
        ></v-textarea>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import firebase from "firebase";
import moment from "moment";

export default {
  name: "ChatRoom",
  components: {},
  data() {
    return {
      messageAreaHeight: "",
      texAreaRows: "1",
      arrayOfMessages: [],
      message: "",
      authUser: {}
    };
  },
  created() {
    this.authUser = this.$store.getters.user;
    console.log("USER ID:", this.authUser.uid);
    this.fetchMessages();
  },
  mounted() {
    this.setMessageAreaHeight();
    this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
    this.$store.commit("SET_LEAGUE_ICON", "Home");
    this.$store.commit("SET_CURRENT_LEAGUE", { name: "Home", id: "" });
  },
  computed: {},
  methods: {
    saveMessage() {
      var dateFromUI = new Date();
      var dateUTC = dateFromUI.toISOString();
      if (this.message.length > 1) {
        db.collection("generalChat")
          .add({
            message: this.message,
            displayName: this.authUser.displayName,
            photoURL: this.authUser.photoURL,
            createdAt: dateUTC
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }

      this.scrollToEnd();
      this.message = null;
      this.texAreaRows = "1";
      // console.log(db);
    },
    fetchMessages() {
      db.collection("generalChat")
        .orderBy("createdAt")
        .onSnapshot(querySnapshot => {
          let allMessages = [];
          querySnapshot.forEach(doc => {
            // console.log(`${doc.id} => ${doc.data()}`);
            allMessages.push(doc.data());
          });
          this.arrayOfMessages = allMessages;

          setTimeout(() => {
            this.scrollToEnd();
          }, 600);
        });
    },
    scrollToEndWithTransition() {
      document.querySelector(".last-msg").scrollIntoView({
        behavior: "smooth"
      });
    },
    scrollToEnd() {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    },
    setMessageAreaHeight() {
      let winH = window.innerHeight;
      let toolbar = document.querySelector(".v-toolbar").clientHeight;

      let textAH = this.$refs.textAreaInput.clientHeight;
      this.messageAreaHeight = winH - textAH - toolbar - 20 + "px";
    },
    onResize() {
      console.log("RESIZE");
      this.setMessageAreaHeight;
    }
  }
  // updated: function() {

  // }
};
</script>

<style scoped>
.rounded {
  border-radius: 10px;
}
.no_scroll {
  overflow-y: auto;
}
.btn-positioning {
  width: 3em;
  bottom: 0 !important;
  right: -10px;
}
</style>
