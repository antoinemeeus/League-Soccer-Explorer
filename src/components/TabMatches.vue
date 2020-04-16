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
        v-for="match in list_team_matches"
        :key="match.id"
        sm6
        xs12
        class="py-1"
        :class="{
          'scroll_target current-match-card': match.id === nextMatch.id
        }"
      >
        <MatchCard
          :league-competition-i-d="competitionID"
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
  props: ["competitionID", "listTeamMatches"],
  data: () => ({}),

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
  },

  mounted() {
    // setTimeout(() => {
    //   var el = document.querySelector(".scroll_target");
    //   if (el) {
    //     var rect = el.getBoundingClientRect(),
    //       scrollLeft =
    //         window.pageXOffset || document.documentElement.scrollLeft,
    //       scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     var halfViewportHeight = window.innerHeight / 2;
    //     this.$vuetify.goTo(el, {
    //       duration: 0,
    //       offset: 0,
    //       easing: "easeInOutCubic"
    //     });
    //     // resolve({
    //     //   x: rect.left + scrollLeft,
    //     //   y: rect.top + scrollTop - halfViewportHeight
    //     // });
    //   }
    // }, 1200);
  },
  methods: {}
};
</script>
