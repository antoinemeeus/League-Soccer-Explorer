<template>
  <v-layout
    py-2
    row
    justify-space-between
    align-center
  >
    <v-flex
      text-xs-center
      xs3
    >
      <v-avatar size="30">
        <v-img
          :src="homeLogoUrl"
          contain
        />
      </v-avatar>
    </v-flex>

    <v-flex
      text-xs-center
      xs6
    >
      <h3>{{ title }}</h3>
    </v-flex>

    <v-flex
      text-xs-center
      xs3
    >
      <v-avatar size="30">
        <v-img
          :src="awayLogoUrl"
          contain
        />
      </v-avatar>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    name: "LogoHeader",
    props: {
        title: String,
        homeLogoUrl: String,
        awayLogoUrl: String,
    },
    data: () => ({}),

    computed: {},
    methods: {}
};
</script>
