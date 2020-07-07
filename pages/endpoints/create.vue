<template>
  <createComponent
    :name="'Endpoint'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :created="created"

    @onBack="BackToList"
    @onCreate="Create"
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
          item-value="code"
        />
      </v-form>
    </v-card-text>
  </createComponent>
</template>

<script>
import createComponent from "@/components/shared/crud/create"

export default {
  components: {
    createComponent
  },
  data () {
    return {
      loading: false,
      formObject: {},
      formValid: false,
      created: false,

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
    async Create () {
      const app = this

      app.loading = true

      let response = await app.$api.EndpointService.Create(app.formObject)

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

      return app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error', color: 'error'})
    },
  },
  mounted () {
    this.FetchModules()
  }
}
</script>

