<template>
  <createComponent
    :name="'Group'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :created="created"

    @onBack="BackToList"
    @onCreate="Create"
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
              v-model="formObject.application"
              label="Application"
              :loading="fetchingApplications"
              :items="applications"
              item-text="name"
              item-value="id"
              @change="ApplicationChanged"
              :rules="[v => !!v || 'Application is required']"
            />
            <v-checkbox
              v-model="formObject.has_all_access"
              label="Has all access"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-container>
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
      formObject: { permissions: [], has_all_access: false },
      formValid: false,
      created: false,

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
    async Create () {
      const app = this

      app.loading = true

      let response = await app.$api.GroupService.Create(app.formObject)

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

      return app.$toast({message: errorData, color: 'error'})
    }
  },
  mounted () {
    this.FetchApplications()
  }
}
</script>


