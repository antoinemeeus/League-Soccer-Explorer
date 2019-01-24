<template>
  <v-container
    py-0
    my-0
    column
    justify-space-between
  >
    <v-layout
      id="text-Area"
      ref="textAreaInput"
      pt-1
    >
      <v-flex xs12>
        <v-text-field
          v-model="message"
          @keyup.enter="saveMessage()"
          auto-grow
          clearable
          color="blue-grey"
        >
          <v-avatar
            slot="prepend"
            size="35"
          >

            <v-img
              :src="this.$store.getters.user.photoURL"
              contain
            >
            </v-img>
          </v-avatar>

          <v-btn
            slot="append-outer"
            @click="saveMessage()"
          >Post</v-btn>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex
        id="container"
        ref="chatWindow"
        :style="`height: ${messageAreaHeight}`"
        class="scroll-y"
        xs12
      >
        <v-layout
          py-2
          column
          v-for="msg in arrayOfMessages"
          :key="msg.id"
        >
          <v-layout pb-1>
            <v-flex
              align-self-start
              xs2
            >
              <v-avatar size="35">
                <v-img
                  :src="msg.data.photoURL"
                  contain
                >
                </v-img>
              </v-avatar>
            </v-flex>
            <v-flex xs10>
              <v-layout column>
                <v-flex>
                  <div class="blue--text subheading">{{msg.data.displayName}}</div>
                </v-flex>
                <v-flex style="word-break:break-all;">
                  <div>
                    {{msg.data.message}}
                  </div>
                </v-flex>
                <v-flex>
                  <span class="grey--text caption">{{ moment(msg.data.createdAt).from(new Date())}}</span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Comments",
  props: ["id_match"],
  data() {
    return {
      messageAreaHeight: "300px",
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
    //this.fetchMessages();
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    getMatchCollectionId() {
      if (typeof this.id_match !== "undefined")
        return "commentMatch" + this.id_match;
      return "commentMatch" + this.$route.params.id_match;
    }
  },
  methods: {
    saveMessage() {
      var dateFromUI = new Date();
      var dateUTC = dateFromUI.toISOString();

      db.collection(this.getMatchCollectionId)
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

      this.message = null;
    },
    fetchMessages() {
      db.collection(this.getMatchCollectionId)
        .orderBy("createdAt")
        .onSnapshot(querySnapshot => {
          let allMessages = [];
          querySnapshot.forEach(doc => {
            //console.log(`${doc.id} => ${doc.data()}`);
            allMessages.push({ id: doc.id, data: doc.data() });
          });
          //Revert all message for recent first
          this.arrayOfMessages = allMessages.reverse();

          // setTimeout(() => {
          //   this.scrollToTop();
          // }, 600);
        });
    },
    scrollToTop() {
      var container = this.$el.querySelector("#container");
      container.scrollTop = 0;
    },
    setMessageAreaHeight() {
      // let winH = window.innerHeight;
      let container = document.querySelector(".v-content__wrap");
      let winH = container.clientHeight;
      let textAH = this.$refs.textAreaInput.clientHeight;
      this.messageAreaHeight = winH - textAH + "px";
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "matchinfo" && from.name == "matchinfo") {
        this.fetchMessages();
      }
    }
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
