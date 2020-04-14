<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi mdi-file-cloud</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Module Details
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Refresh"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Information of module
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <pre v-if="showRaw">{{details}}</pre>
        <div v-else>
          <div v-for="(val, key) in details" :key="key" class="mb-4">
            <v-text-field
              :label="key"
              :value="val"
              hide-details
              disabled
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        details: {},
        showRaw: false,
      }
    },
    mounted () {
      this.FetchDetails(this.$route.params.id)
    },
    methods: {
      async FetchDetails (id) {
        const app = this

        app.loading = true

        let response = await app.$api.ModuleService.View(id)
        
        if (response.success) {
          app.details = {}
          app.details = Object.assign({}, response.data)
        }
        else {
          alert(response.error)
        }
        app.loading = false
      },
      BackToList () {
        this.$router.push(`/modules/`)
      },
      Refresh () {
        this.FetchDetails(this.$route.params.id)
      }
    }
  }
</script>

