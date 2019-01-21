<template>
  <v-container
    py-0
    my-0
    column
    justify-space-between
  >
    <v-layout>
      <v-flex
        id="container"
        ref="chatWindow"
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
            :class="[msg.displayName===authUser.displayName?'sent_msg':'received_msg']"
            max-width="80%"
          >
            <v-layout row>
              <v-flex
                shrink
                px-2
              >
                <v-avatar size="25">
                  <v-img
                    :src="msg.photoURL"
                    contain
                  >
                  </v-img>
                </v-avatar>
              </v-flex>
              <v-layout column>
                <v-flex>
                  {{msg.createdAt}}
                </v-flex>
                <v-flex style="word-break:break-all;">
                  {{msg.message}}
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout justify-center>
              <span class="grey--text">{{msg.displayName}}</span>
            </v-layout>
          </v-card>

        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      id="text-Area"
      ref="textAreaInput"
      pt-1
    >
      <v-flex xs12>
        <v-textarea
          v-model="message"
          @keyup.enter="saveMessage()"
          outline
          autofocus
          counter="300"
          maxlength="300"
          color="blue-grey"
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
import firebase from "firebase";

export default {
  name: "ChatRoom",
  components: {},
  data() {
    return {
      messageAreaHeight: "400px",
      arrayOfMessages: [],
      message: "",
      authUser: {}
    };
  },
  created() {
    this.authUser = this.$store.getters.user;
    this.fetchMessages();
  },
  mounted() {
    this.setMessageAreaHeight();
  },
  computed: {},
  methods: {
    saveMessage() {
      var dateFromUI = new Date();
      var dateUTC = dateFromUI.toISOString();
      // this.arrayOfMessages.push(this.message);
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
      // console.log(this.message);
      this.scrollToEnd();
      this.message = null;
      // console.log(db);
    },
    fetchMessages() {
      db.collection("generalChat")
        .orderBy("createdAt")
        .onSnapshot(querySnapshot => {
          let allMessages = [];
          querySnapshot.forEach(doc => {
            //console.log(`${doc.id} => ${doc.data()}`);
            allMessages.push(doc.data());
          });
          this.arrayOfMessages = allMessages;

          setTimeout(() => {
            this.scrollToEnd();
          }, 600);
        });
    },
    scrollToEnd() {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    },
    setMessageAreaHeight() {
      // let winH = window.innerHeight;
      let container = document.querySelector(".v-content__wrap");
      let winH = container.clientHeight;
      let textAH = this.$refs.textAreaInput.clientHeight;
      this.messageAreaHeight = winH - textAH + "px";
    }
  },
  updated: function() {
    // this.scrollToEnd();
  }
};
</script>

<style scoped>
.sent_msg {
  background-color: #c5cae9;
}
.received_msg {
  background-color: #4db6ac;
}
</style>
