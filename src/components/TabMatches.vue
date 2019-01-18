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
        sm6
        xs12
        class="py-1"
        v-for="match in list_team_matches"
        :key="match.id"
        :class="{'scroll_target current-match-card': match.id===nextMatch.id}"
      >
        <MatchCard
          :iscurrentMatch="match.id===nextMatch.id"
          :indvMatch="match"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MatchCard from "./MatchCard.vue";

export default {
  name: "TabMatches",
  props: ["list_team_matches"],
  components: {
    MatchCard
  },
  data: () => ({}),
  methods: {},

  computed: {
    nextMatch() {
      //Find current or next match by obtaining the next index after the last match with status "FINISHED"
      var lastIndex = 0;
      var len = this.list_team_matches.length;
      for (let i = 0; i < len - 1; i++) {
        if (this.list_team_matches[i].status === "FINISHED") {
          lastIndex = i;
        }
      }
      if (lastIndex + 1 < len) return this.list_team_matches[lastIndex + 1];
      return this.list_team_matches[len - 1];
    }
  }
};
</script>
