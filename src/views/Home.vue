<template>
  <v-container column>
    <v-layout justify-center>
      <h1 class="headlines"> Leagues and Cups</h1>
    </v-layout>
    <v-layout
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
        <LeagueCard
          :img_code="competition.code"
          :league_properties="competition"
        />
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import LeagueCard from "../components/LeagueCard";
export default {
  name: "Home",
  components: {
    LeagueCard
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["league_competition"])
  }
};
</script>
