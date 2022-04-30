<template>
  <v-container fluid>
    <v-layout
      v-for="(item, key) in allEvents"
      :key="key"
      justify-space-around
      py-2
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
      >
        <v-avatar
          color="blue-grey"
          size="40"
        >
          <span class="white--text title">{{ item.minute }}'</span>
        </v-avatar>
      </v-flex>

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
    components: {
        EventCard
    },
    props: {tgoals: Array, tbookings: Array, tsubstitutions: Array},
    data: () => ({}),

    computed: {
        allEvents() {
            return []
                .concat(...[this.tbookings, this.tsubstitutions, this.tgoals])
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
            return evt.team.tType === "homeTeam" || evt.tType === "homeTeam";
        },
        isAway(evt) {
            return evt.team.tType === "awayTeam" || evt.tType === "awayTeam";
        }
    }
};
</script>
