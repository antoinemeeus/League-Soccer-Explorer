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
        v-for="i in jsonFileImported.count"
        :key="i"
        class="pa-2"
        xs6
      >
        <LeagueCard
          :img_code="jsonFileImported.competitions[i-1].code"
          :league_properties="jsonFileImported.competitions[i-1]"
        />
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import LeagueCard from "../components/LeagueCard";
import TempCompetition from "../assets/Competitions.json";
export default {
  name: "Home",
  components: {
    LeagueCard
  },
  data() {
    return {
      jsonFileImported: TempCompetition,
      leagues: [
        { name: "Champions League", country: "Europe" },
        { name: "Primeira Liga", country: "Portugal" },
        { name: "Premier League", country: "Portugal" },
        { name: "Eredivisie", country: "Portugal" },
        { name: "Bundesliga", country: "Portugal" }
      ]
    };
  }
};
</script>
