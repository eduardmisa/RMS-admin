<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>-disabled</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">{{name}}</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1">
          <v-btn v-if="!noAction" color="primary" outlined icon @click="Create" class="mr-3"><v-icon>mdi-plus</v-icon></v-btn>
          <v-btn v-if="!noAction" color="primary" outlined icon @click="Refresh" class="mr-3"><v-icon>mdi-refresh</v-icon></v-btn>
          <v-menu
            v-model="searchMenu"
            transition="slide-y-transition"
            open-on-hover
            :close-on-content-click="false"
            :nudge-width="200"
            left
          >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" outlined icon v-on="on"><v-icon>mdi-magnify</v-icon></v-btn>
            </template>
              <v-text-field
                v-model="tableSearch"
                label="Search"
                append-icon="mdi-magnify"
                hide-details
                solo
              ></v-text-field>
          </v-menu>
        </div>
      </v-card-title>
      <v-card-subtitle>
        List of {{name}}
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>
      <div>
        <div v-if="loading">
          <v-skeleton-loader
            tile
            :type="'table-thead'"
            class="mx-auto"
          />
          <v-skeleton-loader
            tile
            :type="'table-tbody'"
            class="mx-auto"
          />
          <v-skeleton-loader
            tile
            :type="'table-tfoot'"
            class="mx-auto"
          />
        </div>
        <v-data-table
          v-else
          :headers="tableHeaders"
          :items="tableData"
          :search="tableSearch"
          multi-sort
          item-key="name"
          show-expand
          class="elevation-0"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" x-small icon @click="View(item)" class="mr-3"><v-icon>mdi-eye</v-icon></v-btn>
            <v-btn color="primary" x-small icon @click="Update(item)" class="mr-3"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn color="primary" x-small icon @click="Delete(item)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
          <template v-slot:no-data>
            <div class="mt-5 mb-5">
            <v-icon color="primary">mdi-cloud-off-outline</v-icon>
            <br>
            <span class="overline">Empty</span>
            </div>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="2">
              <v-row>
                <v-col>
                  <v-list dense rounded disabled>
                    <v-subheader><span class="primary--text">Frontend Urls</span></v-subheader>
                    <v-list-item-group color="primary">
                      <template v-for="(item, i) in item.routes_fronts">
                        <v-divider
                          v-if="!item"
                          :key="`divider-${i}`"
                        ></v-divider>
                        <v-list-item
                          v-else
                          :key="`item-${i}`"
                          :value="item.id"
                        >
                          <template v-slot:default>
                            <v-list-item-content>
                              <v-list-item-title v-text="item.url"></v-list-item-title>
                            </v-list-item-content>
                          </template>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-col>
                <v-col>
                  <v-list dense rounded disabled>
                    <v-subheader><span class="primary--text">Backend Urls</span></v-subheader>
                    <v-list-item-group color="primary">
                      <template v-for="(item, i) in item.routes_backs">
                        <v-divider
                          v-if="!item"
                          :key="`divider-${i}`"
                        ></v-divider>
                        <v-list-item
                          v-else
                          :key="`item-${i}`"
                          :value="item.id"
                        >
                          <template v-slot:default>
                            <v-list-item-action>
                              <v-list-item-title v-text="item.method"></v-list-item-title>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title v-text="item.url"></v-list-item-title>
                            </v-list-item-content>
                          </template>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
      loading: {
        type: Boolean
      },
      tableData: {
        type: Array
      },
      tableHeaders: {
        type: Array
      },
      noAction: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        searchMenu: false,
        tableSearch: null,
      }
    },
    methods: {
      Refresh () {
        this.$emit('onRefresh')
      },
      View (item) {
        this.$emit('onView', item)
      },
      Create () {
        this.$emit('onCreate')
      },
      Update (item) {
        this.$emit('onUpdate', item)
      },
      Delete (item) {
        this.$emit('onDelete', item)
      }
    }
  }
</script>

