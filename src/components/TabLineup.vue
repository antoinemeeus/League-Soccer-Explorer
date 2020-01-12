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
          py-1
          justify-space-between
          v-for="player in list.homeTeam"
          :key="player.shirtNumber"
        >
          <v-flex>
            {{player.shirtNumber}}
          </v-flex>
          <v-flex text-xs-right>
            {{player.name}}
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs5>
        <v-layout
          py-1
          justify-space-between
          v-for="player in list.awayTeam"
          :key="player.shirtNumber"
        >
          <v-flex text-xs-left>
            {{player.name}}
          </v-flex>
          <v-flex text-xs-right>
            {{player.shirtNumber}}
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "TabLineup",
  props: ["list_"],
  data: () => ({}),
  methods: {},

  computed: {
    list() {
      if (list_) return list_;
    },
    maxListIndex() {
      if (list_) {
        return this.list_.homeTeam.length >= this.list_.awayTeam.length
          ? this.list_.homeTeam.length - 1
          : this.list_.awayTeam.lenght - 1;
      }
    }
  }
};
</script>
