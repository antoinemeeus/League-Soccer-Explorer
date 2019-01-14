<template>
  <v-card
    height="250"
    :to="{ name: 'competition' , params:{ id_competition:league_properties.id }}"
    @click="sendLeagueInfoStore()"
  >

    <v-img
      :src="
      require(`@/assets/leagues_logo/league_${league_properties.code}.png`)"
      aspect-ratio="1"
      max-height="180"
      contain
    >
    </v-img>

    <v-card-text class=" text-xs-center">
      <div class="pt-3">
        <div class="subtitle">{{league_properties.name}}</div>
        <span class="grey--text">{{league_properties.area.name}}</span>
        <span class="grey--text">{{league_properties.id}}</span>
      </div>
    </v-card-text>

  </v-card>
</template>

<script>
export default {
  name: "LeaguesCards",
  props: ["league_properties"],
  data: () => ({}),
  methods: {
    sendLeagueInfoStore() {
      this.$store.commit("SET_LEAGUE_ICON", this.league_properties.code);
      this.$store.commit("SET_APP_TITLE", this.league_properties.name);
    }
  }
};
</script>
