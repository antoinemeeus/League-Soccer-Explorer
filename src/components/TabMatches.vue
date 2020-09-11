<template>
  <v-container
    row
    justify-space-between
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        v-for="match in listTeamMatches"
        :key="match.id"
        sm6
        xs12
        class="py-1"
        :class="{
          'scroll_target current-match-card': match.id === nextMatch.id
        }"
      >
        <MatchCard
          :league-competition-id="competitionId"
          :iscurrent-match="match.id === nextMatch.id"
          :indv-match="match"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MatchCard from "./MatchCard.vue";

export default {
  name: "TabMatches",
  components: {
    MatchCard
  },
  props: ["competitionId", "listTeamMatches"],
  data: () => ({}),
  computed: {
    nextMatch() {
      //Find current or next match by obtaining the next index after the last match with status "FINISHED"
      let lastIndex = 0;
      let len = this.listTeamMatches.length;
      for (let i = 0; i < len - 1; i++) {
        if (this.listTeamMatches[i].status === "FINISHED") {
          lastIndex = i;
        }
      }
      if (lastIndex + 1 < len) return this.listTeamMatches[lastIndex + 1];
      return this.listTeamMatches[len - 1];
    }
  },
  methods: {}
};
</script>
