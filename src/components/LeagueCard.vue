<template>
  <v-card
    height="250"
    :to="{ name: 'competition' , params:{ id_competition:currentCompetition.id }}"
  >

    <v-img
      :src="
      require(`@/assets/leagues_logo/league_${currentCompetition.code}.png`)"
      aspect-ratio="1"
      max-height="180"
      contain
    >
    </v-img>

    <v-card-text class=" text-xs-center">
      <div class="pt-3">
        <div class="subtitle">{{currentCompetition.name}}</div>
        <span class="grey--text">{{currentCompetition.area.name}}</span>
        <span class="grey--text">{{currentCompetition.id}}</span>
      </div>
    </v-card-text>

  </v-card>
</template>

<script>
export default {
  name: "LeaguesCards",
  props: ["currentCompetition"],
  data: () => ({}),
  methods: {
    sendLeagueInfoStore() {
      this.$store.commit("SET_LEAGUE_ICON", this.currentCompetition.code);
      this.$store.commit("SET_APP_TITLE", this.currentCompetition.name);
      this.$store.comit("SET_CURRENT_LEAGUE", this.currentCompetition);
    }
  }
};
</script>
