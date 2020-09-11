<template>
  <v-container
    ma-0
    pa-0
  >
    <v-layout column>
      <v-flex xs12>
        <v-card
          color="green"
          flat
        >
          <v-layout
            align-center
            justify-space-around
            px-1
            py-3
          >
            <v-flex xs4>
              <v-avatar
                color="grey"
                size="120"
              >
                <v-img
                  :src="getImageUrl"
                  contain
                />
              </v-avatar>
            </v-flex>
            <v-flex xs8>
              <v-layout
                column
                justify-space-around
              >
                <v-flex
                  class="text-xs-center display-1"
                  xs12
                >
                  {{ getPlayer.strPlayer }}
                </v-flex>
                <v-flex
                  align-self-center
                  class="title text-grey"
                >
                  {{ getPlayer.strPosition }}, {{ getAge(getPlayer.dateBorn) }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-layout py-2>
          <v-flex>
            <v-layout
              align-center
              column
            >
              <v-flex class="display-1">
                {{ getPlayer.strTeam }}
              </v-flex>
              <v-flex class="header">
                <div class="orange--text">
                  Started in: {{ getPlayer.dateSigned }}
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer />
          <v-flex>
            <v-avatar>
              <v-img
                :src="team_football_org.crestUrl"
                contain
              />
            </v-avatar>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider />
      <v-flex
        pt-2
        px-2
        xs12
      >
        <v-layout wrap>
          <v-flex xs12>
            <h4 class="title">
              Player Sheet
            </h4>
          </v-flex>
          <v-flex xs12>
            Nationality: {{ getPlayer.strNationality }}
          </v-flex>
          <v-flex xs12>
            Height: {{ getPlayer.strHeight }} m
          </v-flex>
          <v-flex xs12>
            Weight: {{ getPlayer.strWeight }} kg
          </v-flex>
          <v-flex xs12>
            Signing price tag: {{ getPlayer.strSigning }}
          </v-flex>
        </v-layout>
      </v-flex>

      <v-layout>
        <!-- {{getPlayer.strDescriptionEN}} -->
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PlayerInfo",

  components: {},
  props: ["idPlayer", "displayedPlayer"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["team_football_org", "team_players"]),

    getPlayer() {
      if (typeof this.displayed_player === "undefined") {
        console.log("Displayed player was undefined");
        return this.team_players.find(obj => obj.idPlayer == this.id_player);
      } else return this.displayed_player;
    },
    getImageUrl() {
      if (this.getPlayer.strCutout) {
        console.log("strCutout exits");
        console.log(this.getPlayer.strCutout);
        return this.getPlayer.strCutout;
      }
      if (this.getPlayer.strThumb) {
        console.log("strThumb exits");
        return this.getPlayer.strThumb;
      }
      return require("@/assets/CutOutPlaceHolder.jpg");
    }
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    getAge(dateString) {
      var birthDate = new Date(dateString);
      var ageDifMs = Date.now() - birthDate.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  },
};
</script>
