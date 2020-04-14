<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="tableLoading">
      <v-system-bar color="primary" v-if="!tableLoading"> <v-spacer></v-spacer> <v-icon>mdi mdi-file-cloud</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Modules
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="Create" class="ml-3 mr-3"><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Refresh" class="mr-3"><v-icon>mdi-refresh</v-icon></v-btn>
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
      </v-card-title>
      <v-card-subtitle>
        Admin page for creating modules
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>
      
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        :search="tableSearch"
        multi-sort
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
      </v-data-table>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        searchMenu: false,
        tableLoading: false,
        tableSearch: null,

        tableData: []
      }
    },
    mounted () {
      this.Refresh()
    },
    computed: {
      tableHeaders () {
        let headers = new this.$modelSchema.Module().getHeaders()

        headers.push(
          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: 125 },
        )
        return headers
      }
    },
    methods: {
      async Refresh () {
        const app = this

        app.tableLoading = true

        let response = await app.$api.ModuleService.List({pageSize: 1000})
        app.tableData = []
        app.tableSearch = null
        if (response.success) {
          response.data.results.forEach(item => {
            app.tableData.push(item)
          })
        }
        else {
          alert(response.error)
        }
        app.tableLoading = false
      },
      View (item) {
        this.$router.push(`/modules/${item.id}/`)
      },
      Create () {
        this.$router.push(`/modules/create/`)
      },
      Update (item) {
        this.$router.push(`/modules/${item.id}/update/`)
      },
      Delete (item) {
        this.$router.push(`/modules/${item.id}/delete/`)
      }
    }
  }
</script>

