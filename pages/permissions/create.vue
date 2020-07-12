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
          v-model="formObject.service"
          label="Service"
          :loading="fetchingServices"
          :items="services"
          item-text="name"
          item-value="code"
          @change="FetchServiceRoutes"
          :rules="[v => !!v || 'Service is required']"
        />
        <v-row>
          <v-col>
            <v-list dense rounded>
              <v-subheader>Service Routes <v-progress-circular indeterminate color="primary" :size="20" class="ml-3" v-if="fetchingServiceRoutes"/></v-subheader>
              <v-list-item-group color="primary" multiple v-model="formObject.service_routes">
                <template v-for="(item, i) in serviceRoutes">
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
      formObject: { service_routes: [] },
      formValid: false,
      created: false,

      fetchingServices: false,
      services: [],
      fetchingServiceRoutes: false,
      serviceRoutes: [],
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
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

      app.fetchingServiceRoutes = true

      let response = await app.$api.ServiceRouteService.List({pageSize: 1000, filterField:"service", filterValue:app.formObject.service})

      app.serviceRoutes = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.serviceRoutes.push(item)
        })
      }
      
      app.fetchingServiceRoutes = false
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

      try { app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}) } catch { app.$toast({message: 'Failed to delete', color: 'error'}) }
    }
  },
  mounted () {
    this.FetchServices()
  }
}
</script>

