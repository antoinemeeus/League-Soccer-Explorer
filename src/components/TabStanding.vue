<template>
  <v-data-table
    :headers="headers"
    :items="stadingTable"
    class="elevation-1"
    hide-actions
  >
    <template
      slot="items"
      slot-scope="props"
    >
      <tr :active="props.item.team.id === idTeam">
        <td class="text-xs-center px-0">
          {{ props.item.position }}
        </td>
        <td
          class="text-xs-left px-1"
          @click="goToTeam(props.item.team.id, props.item.team)"
        >
          <v-layout align-center>
            <v-avatar
              size="30"
              tile
            >
              <v-img
                :src="getImgSrc(props.item.team.crestUrl)"
                contain
                max-height="30"
              />
            </v-avatar>
            <v-flex px-2>
              {{ props.item.team.name }}
            </v-flex>
          </v-layout>
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.playedGames }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.won }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.draw }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.lost }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.points }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.goalsFor }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.goalsAgainst }}
        </td>
        <td class="text-xs-left px-1">
          {{ props.item.goalDifference }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "TabMatches",
    props: {
        idTeam: Number
    },
    data: () => ({
        headers: [
            {
                text: "#",
                value: "position",
                align: "center",
                class: " pa-0 px-1 ",
                fixed: true
            },
            {
                text: "Club",
                align: "center",
                sortable: false,
                value: "team",
                class: "subheading px-1",
                fixed: true
            },
            {text: "MP", value: "playedGames", align: "left", class: "px-1"},
            {text: "W", value: "won", align: "left", class: "px-1"},
            {text: "D", value: "draw", align: "left", class: "px-1"},
            {text: "L", value: "lost", align: "left", class: "px-1"},
            {text: "Pts", value: "points", align: "left", class: "px-1"},
            {text: "GF", value: "goalsFor", align: "left", class: "px-1"},
            {text: "GA", value: "goalsAgainst", align: "left", class: "px-1"},
            {text: "GD", value: "goalDifference", align: "left", class: "px-1"}
        ]
    }),
    computed: {
        ...mapState(["league_standings", "league_teams"]),

        stadingTable() {
            return this.league_standings.standings.find(obj => obj.type === "TOTAL")
                .table;
        }
    },
    methods: {
        getImgSrc(src) {
            if (src) return src;
            return require("@/assets/placeholdershield.png");
        },
        goToTeam(id_next, next_team) {
            this.$router.replace({
                name: "teaminfo",
                params: {idTeam: id_next, displayedTeam: next_team}
            });
        }
    }
};
</script>
