<template>
  <v-container
    row
    justify-space-between
  >
    <v-layout
      row
      justify-space-between
    >
      <v-flex xs5>
        <v-layout
          v-for="player in nonEmptyList.homeTeam"
          :key="player.shirtNumber"
          py-1
          justify-space-between
        >
          <v-flex>
            {{ player.shirtNumber }}
          </v-flex>
          <v-flex text-xs-right>
            {{ player.name }}
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs5>
        <v-layout
          v-for="player in nonEmptyList.awayTeam"
          :key="player.shirtNumber"
          py-1
          justify-space-between
        >
          <v-flex text-xs-left>
            {{ player.name }}
          </v-flex>
          <v-flex text-xs-right>
            {{ player.shirtNumber }}
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "TabLineup",
  props: ["list"],
  data: () => ({}),

  computed: {
    nonEmptyList() {
      if (this.list) return this.list;
      return [];
    },
    maxListIndex() {
      if (this.list) {
        return this.list.homeTeam.length >= this.list.awayTeam.length
          ? this.list.homeTeam.length - 1
          : this.list.awayTeam.lenght - 1;
      }
      return 0;
    }
  },
  methods: {}
};
</script>
