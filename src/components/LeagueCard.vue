<template>
  <v-card
    height="270"
    :to="{
      name: 'competition',
      params: { id_competition: currentCompetition.id }
    }"
  >
    <div
      v-if="!isDataAvailable"
      class="font-weight-black caption red--text"
    >
      * missing some data.
    </div>
    <v-img
      :src="
        require(`@/assets/leagues_logo/league_${currentCompetition.code}.png`)
      "
      aspect-ratio="1"
      max-height="180"
      contain
    />
    <v-card-text class=" text-xs-center">
      <div class="pt-1">
        <div class="subtitle">
          {{ currentCompetition.name }}
        </div>
        <div class="grey--text">
          {{ currentCompetition.area.name }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "LeaguesCards",
  props: ["currentCompetition", "isDataAvailable"],
  data: () => ({}),

  methods: {
    sendLeagueInfoStore() {
      this.$store.commit("SET_LEAGUE_ICON", this.currentCompetition.code);
      this.$store.commit("SET_APP_TITLE", this.currentCompetition.name);
      this.$store.commit("SET_CURRENT_LEAGUE", this.currentCompetition);
    }
  }
};
</script>
