<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!deleted">
      <v-system-bar color="error" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Delete Application
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Delete"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Are you sure you want <br> to delete this item?
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

    <v-card v-else>
      <v-system-bar color="error" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Application Deleted
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Details removed from <br> the database
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-layout
          column
          justify-center
          align-center
        >
          <v-icon color="primary">mdi-delete</v-icon>
        </v-layout>
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
        deleted: false,
      }
    },
    mounted () {
      this.FetchDetails(this.$route.params.id)
    },
    methods: {
      BackToList () {
        this.$router.push(`/applications/`)
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
      async Delete () {
        const app = this

        let id = app.$route.params.id

        app.loading = true

        let response = await app.$api.ApplicationService.Delete(id)
        
        if (response.success)
          app.HandleFormSuccess(response.data)
        else
          app.HandleFormError(response.error)

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

      HandleFormSuccess (data) {
        const app = this
        app.deleted = true
      },
      HandleFormError (errorData) {
        const app = this
        app.$toast({message: errorData, color: 'error'})
      }
    }
  }
</script>

