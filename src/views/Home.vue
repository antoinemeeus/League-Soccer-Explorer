<template>
  <v-container column>
    <v-layout justify-center>
      <h1 class="headlines"> Leagues and Cups</h1>
    </v-layout>
    <v-layout
      v-if="!loadingLeague"
      row
      wrap
    >
      <v-flex
        v-for="competition in league_competition.competitions"
        :key="competition.id"
        class="pa-2"
        xs6
        sm4
        md3
      >
        <LeagueCard :currentCompetition="competition" />
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LeagueCard from "../components/LeagueCard";
export default {
  name: "Home",
  components: {
    LeagueCard
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["loadingLeague", "league_competition"]),

    validCompetition(){
      
    }
  },
  methods: {
    ...mapActions(["fetchAPI"])
  }
};
</script>
