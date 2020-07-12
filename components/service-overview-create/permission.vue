<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-form :value="formValid" @input="FormValidity">
      <v-card>
        <!-- <pre>{{value}}</pre> -->

        <v-system-bar color="primary"> <v-spacer></v-spacer> <v-icon>-disabled</v-icon> <v-spacer></v-spacer> </v-system-bar>
        <v-card-title>
          <span class="mr-3">{{name}}</span>
          <v-spacer></v-spacer>
          <div class="mt-2 mb-1">
            <v-btn color="primary" outlined icon @click="Create" class="mr-3"><v-icon>mdi-plus</v-icon></v-btn>
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

        <v-data-table
          :headers="tableHeaders"
          :items="value"
          :search="tableSearch"
          disable-pagination
          hide-default-footer
          disable-sort
          item-key="id"
          show-expand
          class="elevation-0"
        >
          <template v-slot:item.name="{ item }">
            <v-text-field
              :value="item.name"
              @input="Input($event, item)"
              :rules="[v => !!v || 'Field is required']"
              hide-details
              dense
            />
          </template>
          <template v-slot:item.description="{ item }">
            <v-text-field
              :value="item.description"
              @input="InputDescription($event, item)"
              hide-details
              dense
            />
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="3">
              <v-row>
              <v-col>
                <v-list dense rounded>
                  <v-subheader><span class="primary--text">Frontend Urls</span></v-subheader>
                  <v-list-item-group color="primary" multiple v-model="item.routes_fronts">
                    <template v-for="(item, i) in front_routes">
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
                <v-list dense rounded>
                  <v-subheader><span class="primary--text">Backend Urls</span></v-subheader>
                  <v-list-item-group color="primary" multiple v-model="item.routes_backs">
                    <template v-for="(item, i) in back_routes">
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
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" x-small icon @click="Delete(item)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
          <template v-slot:no-data>
            <div class="mt-5 mb-5">
            <v-icon color="primary">mdi-cloud-off-outline</v-icon>
            <br>
            <span class="overline">Empty</span>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-form>
  </v-layout>
</template>

<script>
  export default {
    props: {
      value: {
        type: Array,
        default: () => { return [] }
      },
      name: {
        type: String
      },
      tableHeaders: {
        type: Array
      },
      front_routes: {
        type: Array
      },
      back_routes: {
        type: Array
      },
      formValid: {
        type: Boolean
      },
    },
    data () {
      return {
        searchMenu: false,
        tableSearch: null,
      }
    },
    methods: {
      Input (val, item) {
        var existingItem = this.value.find(a => a.id === item.id)
        if (existingItem) {
          existingItem.name = val
        }
        this.$emit('input', this.value)
      },
      InputDescription (val, item) {
        var existingItem = this.value.find(a => a.id === item.id)
        if (existingItem) {
          existingItem.description = val
        }
        this.$emit('input', this.value)
      },

      Create () {
        this.value?.push({
            id: this.$helpers.guid.generateGUID(),
            name: "",
            description: "",
            routes_fronts: [],
            routes_backs: [],
            })
        this.$emit('input', this.value)
      },
      Delete (item) {
        var existingItem = this.value.find(a => a.id === item.id)
        if (existingItem) {
          this.value.splice(this.value.indexOf(existingItem),1)
        }
        this.$emit('input', this.value)
      },
      FormValidity (val) {
        this.$emit('onFormValidity', val)
      }
    }
  }
</script>

