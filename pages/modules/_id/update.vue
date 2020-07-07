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
          v-model="formObject.parent"
          label="Parent"
          :loading="fetchingModules"
          :items="modules"
          item-text="name"
          item-value="code"
          clearable
        />
        <v-autocomplete
          v-model="formObject.route_front"
          label="Frontend Route"
          :loading="fetchingRouteFront"
          :items="routesFront"
          item-text="url"
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

      fetchingRouteFront: false,
      routesFront: [],
      // fetchingRouteFront: false,
      // applications: [],
      fetchingModules: false,
      modules: []
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchRoutesFront () {
      const app = this

      app.fetchingRouteFront = true

      let response = await app.$api.FrontendRouteService.List({pageSize: 1000})

      app.routesFront = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.routesFront.push(item)
        })
      }
      
      app.fetchingRouteFront = false
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
      app.formObject.parent = app.formObject.parent.code
      app.formObject.route_front = app.formObject.route_front.code
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

      return app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error', color: 'error'})
    }
  },
  mounted () {
    this.slug = this.$route.params.id
    this.FetchDetails()
    this.FetchRoutesFront()
    this.FetchModules()
  }


}
</script>

