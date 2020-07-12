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
    <v-card-text>
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
          v-model="formObject.icon"
          label="Icon"
        />
        <v-autocomplete
          v-model="formObject.service"
          label="Service"
          :loading="fetchingServices"
          :items="services"
          item-text="name"
          item-value="code"
          :rules="[v => !!v || 'Service is required']"
          @change="ServiceChanged"
        />
        <v-autocomplete
          v-model="formObject.route"
          label="Route"
          :loading="fetchingServiceRoute"
          :items="serviceRoutes"
          item-text="url"
          item-value="code"
          clearable
        />
        <v-autocomplete
          v-model="formObject.parent"
          label="Parent"
          :loading="fetchingModules"
          :items="modules"
          item-text="name"
          item-value="code"
          clearable
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

      fetchingServices: false,
      services: [],
      fetchingServiceRoute: false,
      serviceRoutes: [],
      fetchingModules: false,
      modules: []
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    ServiceChanged () {
      const app = this
      setTimeout(() => {
        app.formObject.route = null
        app.formObject.parent = null
      },1)
      app.FetchServiceRoutes()
      app.FetchModules()
    },
    async FetchServices () {
      const app = this

      app.fetchingServices = true

      let response = await app.$api.ServiceService.List({pageSize: 1000})

      app.services = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.services.push(item)
        })
      }
      
      app.fetchingServices = false
    },
    async FetchServiceRoutes () {
      const app = this

      app.fetchingServiceRoute = true

      let response = await app.$api.ServiceRouteService.List({
          pageSize: 1000,
          filterField: 'service',
          filterValue: app.formObject.service
        })

      app.serviceRoutes = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.serviceRoutes.push(item)
        })
      }
      
      app.fetchingServiceRoute = false
    },
    async FetchModules () {
      const app = this

      app.fetchingModules = true

      let response = await app.$api.ModuleService.List({
          pageSize: 1000,
          filterField: 'service',
          filterValue: app.formObject.service
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
      app.formObject.service = app.formObject.service ? app.formObject.service.code : null
      app.formObject.route = app.formObject.route ? app.formObject.route.code : null
      app.formObject.parent = app.formObject.parent ? app.formObject.parent.code : null
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

      try { app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}) } catch { app.$toast({message: 'Failed to delete', color: 'error'}) }
    }
  },
  async mounted () {
    this.slug = this.$route.params.id
    await this.FetchDetails()
    this.FetchServices()
    this.FetchServiceRoutes()
    this.FetchModules()
  }
}
</script>

