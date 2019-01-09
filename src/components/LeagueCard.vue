<template>
  <v-card
    height="250"
    :to="`/competition/${league_properties.id}`"
    @click="setToolBarInfo()"
  >
    <v-img
      :src="require(`@/assets/leagues_logo/league_${league_properties.code}.png`)"
      aspect-ratio="1"
      contain
    >
    </v-img>

    <v-card-title primary-title>
      <div>
        <div class="subtitle">{{league_properties.name}}</div>
        <span class="grey--text">{{league_properties.area.name}}</span>
        <span class="grey--text">{{league_properties.id}}</span>
      </div>
    </v-card-title>

  </v-card>
</template>

<script>
export default {
  name: "LeaguesCards",
  props: ["league_properties"],
  data: () => ({}),
  methods: {
    setToolBarInfo() {
      this.$store.commit("SET_TITLE", this.league_properties.name);
      this.$store.commit("SET_ICON", this.league_properties.code);
    }
  }
};
</script>

