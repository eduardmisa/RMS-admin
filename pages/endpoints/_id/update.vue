<template>
  <updateComponent
    :name="'Endpoint'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :updated="updated"

    @onBack="BackToList"
    @onFetchDetails="FetchDetails"
    @onUpdate="Update"
  >
    <v-card-text>
      <v-form v-model="formValid">
        <v-select
          v-model="formObject.method"
          :items="['GET', 'POST', 'PUT', 'PATCH','DELETE']"
          label="Method"
          :rules="[v => !!v || 'Method is required']"
        />
        <v-text-field
          v-model="formObject.url"
          label="Url"
          :rules="[v => !!v || 'Url is required']"
        />
        <v-text-field
          v-model="formObject.permission"
          label="Permission"
          :rules="[v => !!v || 'permission is required']"
        />
        <v-autocomplete
          v-model="formObject.module"
          label="Module"
          :loading="fetchingModules"
          :items="modules"
          item-text="name"
          item-value="id"
        />
      </v-form>
    </v-card-text>
  </updateComponent>
</template>

<script>
import updateComponent from "@/components/shared/crud/update"

export default {
  components: {
    updateComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},
      formValid: false,
      updated: false,

      fetchingModules: false,
      modules: []
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchModules () {
      const app = this

      app.fetchingModules = true

      let response = await app.$api.ModuleService.List({pageSize: 1000})

      app.modules = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.modules.push(item)
        })
      }
      
      app.fetchingModules = false
    },   
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.EndpointService.View(this.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Update () {
      const app = this

      app.loading = true

      let response = await app.$api.EndpointService.Update(this.slug, app.formObject)

      if (response.success)
        app.HandleFormSuccess(response.data)
      else
        app.HandleFormError(response.error)

      app.loading = false
    },


    // API RESPONSE HANDLERS
    HandleFetchSuccessResponse (data) {
      const app = this
      app.formObject = {}
      app.formObject = Object.assign({}, data)
    },
    HandleFetchErrorResponse (error) {
      const app = this
      app.$toast({message: error, color: 'error'})
    },

    HandleFormSuccess (data) {
      const app = this
      app.updated = true
      app.formObject = Object.assign({}, data)
    },
    HandleFormError (errorData) {
      const app = this
      if (errorData) {

        let formError = false
        Object.keys(errorData).forEach(errorDataKey => {
          if (Object.keys(app.formObject).includes(errorDataKey)) {
            formError = true
          }
        })

        if (formError) {
          Object.keys(app.formObject).forEach(formKey => {
            delete app.formObject[`${formKey}_error`]
          })

          Object.keys(app.formObject).forEach(formKey => {
            if (Object.keys(errorData).includes(formKey)) {
              app.formObject[`${formKey}_error`] = errorData[formKey]
            }
          })

          return
        }
      }

      return app.$toast({message: errorData, color: 'error'})
    }
  },
  async mounted () {
    this.slug = this.$route.params.id
    await this.FetchDetails()
    await this.FetchModules()
  }


}
</script>

