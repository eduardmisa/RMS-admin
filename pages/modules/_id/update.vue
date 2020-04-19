<template>
  <updateComponent
    :name="'Module'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :updated="updated"

    @onBack="BackToList"
    @onFetchDetails="FetchDetails"
    @onUpdate="Update"
  >
    <v-form v-model="formValid">
      <v-text-field
        v-model="formObject.name"
        label="Name"
        :rules="[v => !!v || 'Name is required']"
      />
      <v-text-field
        v-model="formObject.description"
        label="Description"
      />
      <v-text-field
        v-model="formObject.front_icon"
        label="Front Icon"
      />
      <v-text-field
        v-model="formObject.front_url"
        label="Fron Url"
      />
      <v-autocomplete
        v-model="formObject.application"
        label="Application"
        :loading="fetchingApplications"
        :items="applications"
        item-text="name"
        item-value="id"
        @change="FetchModules"
        :rules="[v => !!v || 'Application is required']"
      />
      <v-autocomplete
        v-model="formObject.parent"
        label="Parent"
        :loading="fetchingModules"
        :items="modules"
        item-text="name"
        item-value="id"
      />
    </v-form>
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

      fetchingApplications: false,
      applications: [],
      fetchingModules: false,
      modules: []
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchApplications () {
      const app = this

      app.fetchingApplications = true

      let response = await app.$api.ApplicationService.List({pageSize: 1000})

      app.applications = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.applications.push(item)
        })
      }
      
      app.fetchingApplications = false
    },
    async FetchModules () {
      const app = this

      app.fetchingModules = true

      let response = await app.$api.ModuleService.List({
          pageSize: 1000,
          filterField: 'application',
          filterValue: app.formObject.application
        })

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

      let response = await app.$api.ModuleService.View(this.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Update () {
      const app = this

      app.loading = true

      let response = await app.$api.ModuleService.Update(this.slug, app.formObject)

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
  async created () {
    this.slug = this.$route.params.id
    await this.FetchDetails()
    await this.FetchApplications()
    await this.FetchModules()
  }


}
</script>

