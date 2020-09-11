<template>
  <v-container
    row
    fluid
    px-1
    justify-space-between
  >
    <v-layout wrap>
      <v-flex
        v-for="player in players"
        :key="player.idPlayer"
        md3
        xs4
        class="pa-1"
      >
        <PlayerCard
          :player="player"
          :busteam-info="teamInfo"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PlayerCard from "./PlayerCard.vue";

export default {
  name: "Tabplayers",
  components: {
    PlayerCard
  },
  props: ["players", "teamInfo"],
  data: () => ({}),
};
</script>
