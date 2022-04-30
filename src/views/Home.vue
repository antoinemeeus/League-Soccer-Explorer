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
    name: "HomeComponent",
    components: {
        LeagueCard
    },
    data() {
        return {};
    },
    computed: {
        ...mapState(["loadingLeague", "league_competition", "league_matches_info"])
    },
    created() {
    },
    mounted() {
    },
    methods: {
        ...mapActions(["fetchAPI"]),
        isDataAvailable(idCompetition) {
            return this.league_matches_info.hasOwnProperty(idCompetition);
        }
    }
};
</script>
