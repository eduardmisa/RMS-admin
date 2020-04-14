<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!created">
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Create Application
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Create"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Fill fields below
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
        Application Created
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Saved details of <br> application
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <div v-for="(val, key) in details" :key="key" class="mb-4">
          <v-text-field
            :label="key"
            :value="val"
            :hide-details="true"
            disabled
          />
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
        created: false,
      }
    },
    mounted () {
      this.details = new this.$modelSchema.Application()
      this.details.clear()
    },
    methods: {
      BackToList () {
        this.$router.push(`/applications/`)
      },
      async Create () {
        const app = this

        app.loading = true

        let response = await app.$api.ApplicationService.Create(app.details)

        if (response.success)
          app.HandleFormSuccess(response.data)
        else
          app.HandleFormError(response.error)

        app.loading = false
      },


      // API RESPONSE HANDLERS
      HandleFormSuccess (data) {
        const app = this
        app.created = true
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

