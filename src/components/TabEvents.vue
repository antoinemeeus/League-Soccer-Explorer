<template>

  <v-container fluid>
    <v-layout
      justify-space-around
      v-for="(item,key) in allEvents"
      :key="key"
    >
      <v-flex xs5>
        <EventCard
          v-if="isHome(item)"
          :event="item"
        />
      </v-flex>

      <v-flex
        text-xs-center
        align-self-center
        xs2
      >{{item.minute}}'</v-flex>

      <v-flex xs5>
        <EventCard
          v-if="isAway(item)"
          :event="item"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EventCard from "./EventCard.vue";
export default {
  name: "TabEvent",
  props: ["Tgoals", "Tbookings", "Tsubstitutions"],
  components: {
    EventCard
  },
  data: () => ({}),
  methods: {},

  computed: {
    allEvents() {
      return []
        .concat(...[this.Tbookings, this.Tsubstitutions, this.Tgoals])
        .sort((a, b) => a.minute - b.minute)
        .reverse();
    }
  },

  methods: {
    colorCard(str) {
      if (str.includes("yellow")) return "yellow";
      if (str.includes("red")) return "red";
      return "white";
    },
    isHome(evt) {
      return evt.team.tType == "homeTeam" || evt.tType == "homeTeam";
    },
    isAway(evt) {
      return evt.team.tType == "awayTeam" || evt.tType == "awayTeam";
    }
  }
};
</script>
