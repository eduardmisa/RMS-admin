<template>
  <viewComponent
    :name="'Group'"
    :formObject="formObject"
    :loading="loading"

    @onBack="BackToList"
    @onRefresh="Refresh"
    @onFetchDetails="FetchDetails"
  >
    <div disabled>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field
              v-model="formObject.name"
              label="Name"
              disabled
            />
            <v-text-field
              v-model="formObject.description"
              label="Description"
              disabled
            />
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="formObject.application"
              label="Application"
              :loading="fetchingApplications"
              :items="applications"
              item-text="name"
              item-value="code"
              disabled
            />
            <v-checkbox
              v-model="formObject.has_all_access"
              label="Has all access"
              disabled
            />
          </v-col>
        </v-row>
        <v-row>
          <v-container>
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
                      :value="item.id"
                      
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
              <!-- <span> <strong>Permissions</strong> </span> -->
              <!-- <v-text-field
                v-model="searchTree"
                label="Search"
                outlined
                hide-details
                dense
                clearable
              /> -->
              <!-- <v-treeview
                v-if="!fetchingPermissions"
                v-model="formObject.permissions"
                :items="treeItems"
                :search="searchTree"
                dense
                open-all
                open-on-click
                selectable
                selected-color="primary"
                transition
              /> -->
            </div>
          </v-container>
        </v-row>
      </v-form>
      <!-- <v-row>
        <v-col>
          <span class="font-weight-medium primary--text body-2">Permissions</span><br>
          <v-text-field
            v-model="searchTree"
            label="Search"
            outlined
            hide-details
            dense
            clearable
          />
          <v-treeview
            v-if="!fetchingPermissions"
            :value="formObject.permissions"
            :items="treeItems"
            :search="searchTree"
            dense
            open-all

            selectable
            selected-color="primary"
            transition
          />
        </v-col>
        <v-col>
          <div v-for="(val, key) in formObject" :key="key" class="mb-2">
            <div v-if="key != 'permissions'">
              <span class="font-weight-medium primary--text body-2">{{key}}</span><br>
              <span class="font-regular body-1">{{val ? val : '&nbsp'}}</span>
              <v-divider class="mt-1"></v-divider>
            </div>
          </div>
        </v-col>
      </v-row> -->
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

      fetchingApplications: false,
      applications: [],

      fetchingPermissions: false,
      permissions: [],
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
    async FetchPermissions () {
      const app = this

      app.fetchingPermissions = true

      app.permissions = []

      let response = await app.$api.PermissionService.List({pageSize: 1000, filterField: "application", filterValue: app.formObject.application})
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
  },
  async mounted () {
    const app = this
    app.slug = app.$route.params.id
    
    await app.FetchDetails()
    app.FetchPermissions()
    app.FetchApplications()
  }
}
</script>

