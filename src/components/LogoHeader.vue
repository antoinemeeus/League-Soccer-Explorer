<template>

  <v-layout
    pb-2
    row
    justify-space-between
    align-center
  >

    <v-flex
      text-xs-center
      xs3
    >
      <v-avatar>
        <v-img
          :src="homeLogoUrl"
          contain
        ></v-img>
      </v-avatar>
    </v-flex>

    <v-flex
      text-xs-center
      xs6
    >
      <h3>{{title}}</h3>
    </v-flex>

    <v-flex
      text-xs-center
      xs3
    >
      <v-avatar>
        <v-img
          :src="awayLogoUrl"
          contain
        ></v-img>
      </v-avatar>
    </v-flex>
  </v-layout>

</template>

<script>
export default {
  name: "TabStat",
  props: ["title", "homeLogoUrl", "awayLogoUrl"],
  data: () => ({}),
  methods: {},

  computed: {}
};
</script>
