<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">Application Details</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1">
          <v-btn color="primary" outlined icon @click="BackToList" class="mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <v-btn color="primary" outlined icon @click="Refresh"><v-icon>mdi-refresh</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        Information of application
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-container class="pl-4 pr-4">
        <pre v-if="showRaw">{{details}}</pre>
        <div v-else>
          <div v-for="(val, key) in details" :key="key" class="mb-2">
            <span class="font-weight-medium primary--text body-2">{{key}}</span><br>
            <span class="font-regular body-1">{{val ? val : '&nbsp'}}</span>
            <v-divider class="mt-1"></v-divider>
          </div>
        </div>
      </v-container>
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
      BackToList () {
        this.$router.push(`/applications/`)
      },
      Refresh () {
        this.FetchDetails(this.$route.params.id)
      },
      async FetchDetails (id) {
        const app = this

        app.loading = true

        let response = await app.$api.ApplicationService.View(id)
        
        if (response.success)
          app.HandleFetchSuccessResponse(response.data)
        else
          app.HandleFetchErrorResponse(response.error)

        app.loading = false
      },


      // API RESPONSE HANDLERS
      HandleFetchSuccessResponse (data) {
        const app = this
        app.details = {}
        app.details = Object.assign({}, data)
      },
      HandleFetchErrorResponse (error) {
        const app = this
        app.$toast({message: error, color: 'error'})
      },
    }
  }
</script>
