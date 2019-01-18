<template>
  <v-card
    height="100%"
    :to="{ name: 'playerinfo' , params:{ id_player:player.idPlayer,displayed_player:player }}"
  >
    <v-img
      :src="`${player.strThumb}/preview`"
      height="100px"
      contain
    >
      <v-layout
        slot="placeholder"
        fill-height
        align-center
        justify-center
        ma-0
      >
        <v-progress-circular
          indeterminate
          color="grey"
        ></v-progress-circular>
      </v-layout>
    </v-img>

    <v-layout
      column
      px-1
      py-1
    >
      <v-flex>
        <div class="body-1">{{player.strPlayer}}</div>
      </v-flex>
      <v-flex>
        <div class="font-italic caption">{{player.strPosition}}</div>
      </v-flex>
    </v-layout>

  </v-card>

</template>

<script>
export default {
  name: "Playercard",
  props: ["player", "player_data_org"],
  data: () => ({}),
  methods: {},

  computed: {}
};
</script>

<style scoped>
.roundedCorner {
  border-radius: 10px;
}
</style>
