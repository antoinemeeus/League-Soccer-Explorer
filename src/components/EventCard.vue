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
          Scorer: {{(event.scorer.split('(')[0] || event.scorer)}}
        </v-flex>
        <v-flex>
          Assist: {{event.assist? event.assist:""}}
        </v-flex>
      </v-layout>
    </v-card>

    <v-card v-if="isSubs">
      <v-flex text-xs-center>
        <h4>
          Substitution
        </h4>
      </v-flex>
      <v-layout column>
        <v-flex>
          PlayerIn: {{(event.playerIn || "")}}
        </v-flex>
        <v-flex>
          PlayerOut: {{(event.playerOut || "")}}
        </v-flex>
      </v-layout>
    </v-card>

    <v-card v-if="isCard">
      <v-flex text-xs-center>

        <h4>
          <v-icon :color="colorCard().toLowerCase()">mdi-card</v-icon>
          {{colorCard()}} Card!
        </h4>
      </v-flex>

      <v-layout column>
        <v-flex>

          Player: {{event.player.name}}
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
  methods: {},

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
