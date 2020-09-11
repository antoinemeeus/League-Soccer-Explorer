<template>
  <v-container
    v-resize="onResize"
    class="no_scroll"
    column
    justify-space-between
    my-0
    py-0
  >
    <v-layout>
      <v-flex
        id="container"
        :style="`height: ${messageAreaHeight}`"
        class="scroll-y"
        xs12
      >
        <v-layout
          v-for="(msg, index) in arrayOfMessages"
          :key="index"
          column
          py-2
        >
          <v-layout
            :class="{ 'last-msg': index === arrayOfMessages.length - 1 }"
            :justify-end="msg.displayName === authUser.displayName"
            pb-1
            widht="70%"
          >
            <v-flex
              :order-xs2="msg.displayName === authUser.displayName"
              align-self-start
              shrink
            >
              <v-avatar size="35">
                <v-img
                  :src="msg.photoURL"
                  contain
                />
              </v-avatar>
            </v-flex>
            <v-flex
              :order-xs1="msg.displayName === authUser.displayName"
              px-1
              shrink
            >
              <v-card
                class="rounded"
                max-width="250"
                min-width="120"
              >
                <v-layout column>
                  <v-flex
                    pb-1
                    px-1
                  >
                    <div
                      :class="[
                        msg.displayName === authUser.displayName
                          ? 'text-xs-right'
                          : ''
                      ]"
                      class="blue--text subheading"
                    >
                      {{ msg.displayName }}
                    </div>
                  </v-flex>
                  <div pa-1>
                    <v-flex
                      px-1
                      style="word-break:break-word;"
                    >
                      <div>
                        {{ msg.message }}
                      </div>
                    </v-flex>
                  </div>
                  <v-flex px-2>
                    <div class="grey--text caption text-xs-right">
                      {{ moment(msg.createdAt).from(new Date()) }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
      <div style="position: relative">
        <v-btn
          absolute
          bottom
          class="btn-positioning"
          color="blue"
          dark
          max="20"
          right
          small
          @click="scrollToEndWithTransition"
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
        ref="bottomChat"
        xs12
      >
        <v-textarea
          v-model="message"
          v-resize="onResize"
          :append-outer-icon="'mdi-send'"
          :rows="texAreaRows"
          auto-grow
          autofocus
          color="blue-grey"
          counter="300"
          maxlength="300"
          placeholder="Type your message here..."
          @keyup.enter="saveMessage()"
          @click:append-outer="saveMessage()"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

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
  computed: {},
  created() {
    this.authUser = this.$store.getters.user;
    console.log("USER ID:", this.authUser.uid);
    this.fetchMessages();
  },
  mounted() {
    this.setMessageAreaHeight();
    this.$store.commit("SET_APP_TITLE", "Leagues And Cups");
    this.$store.commit("SET_LEAGUE_ICON", "Home");
    this.$store.commit("SET_CURRENT_LEAGUE", {name: "Home", id: ""});
  },
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
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
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
      this.setMessageAreaHeight();
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
