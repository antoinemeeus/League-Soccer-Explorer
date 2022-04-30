<template>
  <v-card
    height="100%"
    :to="{
      name: 'playerinfo',
      params: { idPlayer: player.idPlayer, displayed_player: player }
    }"
  >
    <v-img
      :src="playerImageSrc"
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
        />
      </v-layout>
    </v-img>

    <v-layout
      column
      px-1
      py-1
    >
      <v-flex>
        <div class="body-1">
          {{ player.strPlayer }}
        </div>
      </v-flex>
      <v-flex>
        <div class="font-italic caption">
          {{ player.strPosition }}
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
    name: "PlayerCard",
    props: {
        player: Object
    },
    data: () => ({
        failed_image: false
    }),

    computed: {
        playerImageSrc() {
            return this.player.strThumb
                ? this.player.strThumb + "/preview"
                : require("@/assets/CutOutPlaceHolder.jpg");
        }
    },
    methods: {}
};
</script>

<style scoped>
.roundedCorner {
    border-radius: 10px;
}
</style>
