<template>
  <viewComponent
    :name="'Group'"
    :formObject="formObject"
    :loading="loading"

    @onBack="BackToList"
    @onRefresh="Refresh"
    @onFetchDetails="FetchDetails"
  >
    <div>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field
              v-model="formObject.name"
              label="Name"
              readonly
            />
            <v-text-field
              v-model="formObject.description"
              label="Description"
              readonly
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
              readonly
            />
            <v-checkbox
              v-model="formObject.has_all_access"
              label="Has all access"
              readonly
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="!formObject.has_all_access">
              <v-list dense rounded disabled>
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
          <v-col>
            <div v-if="!formObject.has_all_access">
              <v-list dense rounded disabled>
                <v-subheader>Modules <v-progress-circular indeterminate color="primary" :size="20" class="ml-3" v-if="fetchingModules"/></v-subheader>
                <v-list-item-group color="primary" multiple v-model="formObject.modules">
                  <template v-for="(item, i) in modules">
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
    </div>  
  </viewComponent>
</template>

<script>
import viewComponent from "@/components/shared/crud/view"

export default {
  components: {
    viewComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},

      fetchingServices: false,
      services: [],

      fetchingPermissions: false,
      permissions: [],

      fetchingModules: false,
      modules: [],

      searchTree: null
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    Refresh () {
      this.FetchDetails()
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

      let response = await app.$api.GroupService.View(app.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },

    // API RESPONSE HANDLERS
    HandleFetchSuccessResponse (data) {
      const app = this
      app.formObject = {}
      app.formObject = Object.assign({}, data)
      app.formObject.service = app.formObject.service.code
      app.formObject.permissions = app.formObject.permissions.map(a => a.code)
      app.formObject.modules = app.formObject.modules.map(a => a.code)
    },
    HandleFetchErrorResponse (error) {
      const app = this
      app.$toast({message: error, color: 'error'})
    },
  },
  async mounted () {
    const app = this
    app.slug = app.$route.params.id
    
    await app.FetchDetails()
    app.FetchServices()
    app.FetchPermissions()
    app.FetchModules()
  }
}
</script>

