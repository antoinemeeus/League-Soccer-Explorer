<template>

  <v-container
    row
    fluid
    px-1
    justify-space-between
  >
    <v-layout wrap>
      <v-flex
        md3
        xs4
        class="pa-1"
        v-for="player in players"
        :key="player.idPlayer"
      >
        <PlayerCard
          :player="player"
          :busteamInfo="teamInfo"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PlayerCard from "./PlayerCard.vue";

export default {
  name: "Tabplayers",
  props: ["players", "teamInfo"],
  components: {
    PlayerCard
  },
  data: () => ({}),
  methods: {},

  computed: {}
};
</script>
