<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!updated">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">Update Application</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1">
          <v-btn color="primary" outlined icon @click="BackToList" class="mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <v-btn color="primary" outlined icon @click="Update"><v-icon>mdi-content-save</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        Update details of <br> this application
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-for="key in Object.keys(details).filter(a => !a.endsWith('_error'))" :key="key"
          :value="details[key]"
          @input="details[key]=$event"
          :label="key"
          :hide-details="false"
          :error-messages="details[`${key}_error`]"
        />
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Application Updated
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>

      <v-card-subtitle>
        Updated details of <br> application
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
        updated: false,
      }
    },
    mounted () {
      const app = this

      app.FetchDetails(app.$route.params.id)
      .then(function () {
        let sch = new app.$modelSchema.Application()
        sch.clear()
        Object.keys(sch).forEach(key => {
          sch[key] = app.details[key]
        })
        app.details = sch
      })
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
      async Update () {
        const app = this

        app.loading = true

        let response = await app.$api.ApplicationService.Update(this.$route.params.id, app.details)

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
        app.updated = true
        app.details = Object.assign({}, data)
      },
      HandleFormError (errorData) {
        const app = this
        if (errorData) {

          let formError = false
          Object.keys(errorData).forEach(errorDataKey => {
            if (Object.keys(app.details).includes(errorDataKey)) {
              formError = true
            }
          })

          if (formError) {
            Object.keys(app.details).forEach(formKey => {
              delete app.details[`${formKey}_error`]
            })

            Object.keys(app.details).forEach(formKey => {
              if (Object.keys(errorData).includes(formKey)) {
                app.details[`${formKey}_error`] = errorData[formKey]
              }
            })

            return
          }
        }

        return app.$toast({message: errorData, color: 'error'})
      }
    }
  }
</script>

