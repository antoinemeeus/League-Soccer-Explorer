<template>
  <v-container column>
    <v-layout justify-center>
      <h1 class="headlines">
        Leagues and Cups
      </h1>
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
        md3
        sm4
        xs6
      >
        <LeagueCard
          :current-competition="competition"
          :is-data-available="isDataAvailable(competition.id)"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import LeagueCard from "../components/LeagueCard";

export default {
  name: "Home",
  components: {
    LeagueCard
  },
  data() {
    return {};
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapState(["loadingLeague", "league_competition", "league_matches_info"])
  },
  methods: {
    ...mapActions(["fetchAPI"]),
    isDataAvailable(id_competition) {
      return this.league_matches_info.hasOwnProperty(id_competition);
    }
  }
};
</script>
