<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-form :value="formValid" @input="FormValidity">
      <v-card>
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
          class="elevation-0"
        >
          <template v-slot:item.method="{ item }">
            <v-select
              :value="item.method"
              @input="InputMethod($event, item)"
              :items="['GET','POST','PUT','DELETE']"
              :rules="[v => !!v || 'Method is required']"
              hide-details
              dense
              class="pt-5 pb-5"
              :width="50"
            />
          </template>
          <template v-slot:item.url="{ item }">
            <v-text-field
              :value="item.url"
              @input="Input($event, item)"
              :rules="[v => !!v || 'Field is required']"
              hide-details
              dense
            />
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
          existingItem.url = val
        }
        this.$emit('input', this.value)
      },
      InputMethod (val, item) {
        var existingItem = this.value.find(a => a.id === item.id)
        if (existingItem) {
          existingItem.method = val
        }
        this.$emit('input', this.value)
      },

      Create () {
        this.value?.push({ id: this.$helpers.guid.generateGUID(), method: "", url: ""})
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

