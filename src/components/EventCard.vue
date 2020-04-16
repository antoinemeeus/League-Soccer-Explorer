<template>
  <v-container
    pa-1
    ma-0
  >
    <v-card v-if="isGoal">
      <v-flex text-xs-center>
        <h4>
          Goal!
        </h4>
      </v-flex>

      <v-layout column>
        <v-flex>
          Scorer: {{ event.scorer.split("(")[0] || event.scorer }}
        </v-flex>
        <v-flex> Assist: {{ event.assist ? event.assist : "" }} </v-flex>
      </v-layout>
    </v-card>

    <v-card v-if="isSubs">
      <v-flex text-xs-center>
        <h4>
          Substitution
        </h4>
      </v-flex>
      <v-layout
        wrap
        align-center
        justify-space-between
      >
        <v-flex xs12>
          <v-icon color="green">
            mdi-arrow-up
          </v-icon>
          <span>{{ event.playerIn || "" }}</span>
        </v-flex>
        <v-flex xs12>
          <v-icon color="red">
            mdi-arrow-down
          </v-icon>
          <span>{{ event.playerOut || "" }}</span>
        </v-flex>
      </v-layout>
    </v-card>

    <v-card v-if="isCard">
      <v-layout
        column
        align-center
        justify-center
      >
        <v-flex
          xs12
          text-xs-center
        >
          <h4>{{ colorCard() }} Card!</h4>
        </v-flex>
        <v-flex xs12>
          <v-icon :color="colorCard().toLowerCase()">
            mdi-card
          </v-icon>
          {{ event.player.name }}
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "EventCard",
  props: ["event"],
  data: () => ({}),

  computed: {
    isGoal() {
      if (typeof this.event.scorer == "undefined") return false;
      return true;
    },
    isSubs() {
      if (typeof this.event.playerIn == "undefined") return false;
      return true;
    },
    isCard() {
      if (typeof this.event.card == "undefined") return false;
      return true;
    }
  },
  methods: {},

  methods: {
    colorCard() {
      var str = this.event.card;
      if (str.includes("yellow")) return "Yellow";
      if (str.includes("red")) return "Red";
      return "";
    }
  }
};
</script>
