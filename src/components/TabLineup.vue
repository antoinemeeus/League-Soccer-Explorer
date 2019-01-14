<template>

  <v-container fluid>
    <v-layout
      justify-space-between
      pt-3
      v-for="index in maxListLenght"
      :key="index"
    >
      <v-flex
        text-xs-center
        xs1
      >
        {{list_.homeTeam[index].shirtNumber}}
      </v-flex>
      <v-flex
        text-xs-left
        xs3
      >
        {{list_.homeTeam[index].name}}
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex
        text-xs-right
        xs3
      >
        {{list_.awayTeam[index].name}}
      </v-flex>
      <v-flex
        text-xs-center
        xs1
      >
        {{list_.homeTeam[index].shirtNumber}}
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
export default {
  name: "TabStat",
  props: ["list_"],
  data: () => ({}),
  methods: {},

  computed: {
    maxListLenght() {
      return this.list_.homeTeam.length >= this.list_.awayTeam.length
        ? this.list_.homeTeam.length - 1
        : this.list_.awayTeam.lenght - 1;
    }
  }
};
</script>
