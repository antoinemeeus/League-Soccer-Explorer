<template>

  <v-container>

  </v-container>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Matches",

  components: {},
  props: ["id_match"],
  data() {
    return {};
  },
  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  computed: {
    ...mapState(["league_competition", "league_matches", "league_teams"]),

    currentMatch() {
      return this.league_matches.competitions.find(
        obj => obj.id == this.id_match
      );
    }
  },

  methods: {},
  watch: {}
};
</script>
