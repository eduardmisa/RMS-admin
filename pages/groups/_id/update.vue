<template>
  <updateComponent
    :name="'Group'"
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
        <v-row>
          <v-col>
            <v-text-field
              v-model="formObject.name"
              label="Name"
              :rules="[v => !!v || 'Name is required']"
            />
            <v-text-field
              v-model="formObject.description"
              label="Description"
            />
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="formObject.service"
              label="Service"
              :loading="fetchingServices"
              :items="services"
              item-text="name"
              item-value="code"
              @change="ApplicationChanged"
              :rules="[v => !!v || 'Service is required']"
            />
            <v-checkbox
              v-model="formObject.has_all_access"
              label="Has all access"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="!formObject.has_all_access">
              <v-list dense rounded>
                <v-subheader>Permissions <v-progress-circular indeterminate color="primary" :size="20" class="ml-3" v-if="fetchingPermissions"/></v-subheader>
                <v-list-item-group color="primary" multiple v-model="formObject.permissions">
                  <template v-for="(item, i) in permissions">
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
                          <v-list-item-title v-text="item.name"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </div>
          </v-col>
        </v-row>
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

      fetchingPermissions: false,
      permissions: [],

      searchTree: null
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
    async FetchPermissions () {
      const app = this

      app.fetchingPermissions = true

      app.permissions = []

      let response = await app.$api.PermissionService.List({
          pageSize: 1000,
          filterField: "service",
          filterValue: app.formObject.service
        })
      if (response.success) {
        response.data.results.forEach(item => {
          app.permissions.push(item)
        })
      }

      app.fetchingPermissions = false
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.GroupService.View(app.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Update () {
      const app = this

      app.loading = true

      let response = await app.$api.GroupService.Update(this.slug, app.formObject)

      if (response.success)
        app.HandleFormSuccess(response.data)
      else
        app.HandleFormError(response.error)

      app.loading = false
    },
    async ApplicationChanged () {
      const app = this
      await app.FetchPermissions()
      app.formObject.permissions = []
    },


    // API RESPONSE HANDLERS
    HandleFetchSuccessResponse (data) {
      const app = this
      app.formObject = {}
      app.formObject = Object.assign({}, data)
      app.formObject.service = app.formObject.service.code
      app.formObject.permissions = app.formObject.permissions.map(a => a.code)
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
    const app = this
    app.slug = app.$route.params.id
    app.fetchingPermissions = true

    await app.FetchDetails()
    app.FetchServices()
    app.FetchPermissions()
  }


}
</script>

