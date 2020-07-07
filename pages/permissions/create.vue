<template>
  <createComponent
    :name="'Permissions'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :created="created"

    @onBack="BackToList"
    @onCreate="Create"
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
        <v-autocomplete
          v-model="formObject.application"
          label="Application"
          :loading="fetchingApplications"
          :items="applications"
          item-text="name"
          item-value="code"
          @change="_ => {FetchRoutesFront();FetchRoutesBack();}"
          :rules="[v => !!v || 'Application is required']"
        />
        <v-row>
          <v-col>
            <v-list dense rounded>
              <v-subheader>Frontend Urls <v-progress-circular indeterminate color="primary" :size="20" class="ml-3" v-if="fetchingRouteFront"/></v-subheader>
              <v-list-item-group color="primary" multiple v-model="formObject.route_front">
                <template v-for="(item, i) in routesFront">
                  <v-divider
                    v-if="!item"
                    :key="`divider-${i}`"
                  ></v-divider>
                  <v-list-item
                    v-else
                    :key="`item-${i}`"
                    :value="item.code"
                    
                  >
                    <template v-slot:default>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.url"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col>
            <v-list dense rounded>
              <v-subheader>Backend Urls <v-progress-circular indeterminate color="primary" :size="20" class="ml-3" v-if="fetchingRouteBack"/></v-subheader>
              <v-list-item-group color="primary" multiple v-model="formObject.route_back">
                <template v-for="(item, i) in routesBack">
                  <v-divider
                    v-if="!item"
                    :key="`divider-${i}`"
                  ></v-divider>
                  <v-list-item
                    v-else
                    :key="`item-${i}`"
                    :value="item.code"
                  >
                    <template v-slot:default>
                      <v-list-item-action>
                        <v-list-item-title v-text="item.method"></v-list-item-title>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.url"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
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

      fetchingApplications: false,
      applications: [],
      fetchingRouteFront: false,
      routesFront: [],
      fetchingRouteBack: false,
      routesBack: [],
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
    async FetchRoutesFront () {
      const app = this

      app.fetchingRouteFront = true

      let response = await app.$api.FrontendRouteService.List({pageSize: 1000, filterField:"application", filterValue:app.formObject.application})

      app.routesFront = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.routesFront.push(item)
        })
      }
      
      app.fetchingRouteFront = false
    },
    async FetchRoutesBack () {
      const app = this

      app.fetchingRouteBack = true

      let response = await app.$api.BackendRouteService.List({pageSize: 1000, filterField:"application", filterValue:app.formObject.application})

      app.routesBack = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.routesBack.push(item)
        })
      }
      
      app.fetchingRouteBack = false
    },
    async Create () {
      const app = this

      app.loading = true

      let response = await app.$api.PermissionService.Create(app.formObject)

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

      return app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}), color: 'error'})
    }
  },
  mounted () {
    this.FetchApplications()
  }
}
</script>

