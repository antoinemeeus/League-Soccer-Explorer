<template>

  <v-container
    fluid
    pa-2
  >

    <v-layout
      justify-space-between
      pt-3
      v-for="item in stats"
      :key="item.name"
    >
      <v-flex
        text-xs-center
        xs3
      >
        {{item.homeTeam}}
      </v-flex>
      <v-flex
        text-xs-center
        xs6
      >
        {{item.name}}
      </v-flex>
      <v-flex
        text-xs-center
        xs3
      >
        {{item.awayTeam}}
      </v-flex>
    </v-layout>

  </v-container>

</template>

<script>
export default {
  name: "TabStat",
  props: ["stats"],
  data: () => ({}),
  methods: {},

  computed: {}
};
</script>
