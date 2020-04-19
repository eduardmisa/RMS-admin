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
            <span> <strong>Permissions</strong> </span>
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
              v-model="formObject.permissions"
              :items="treeItems"
              :search="searchTree"
              dense
              open-all
              open-on-click
              selectable
              selected-color="primary"
              transition
            />
          </div>
        </v-container>
      </v-row>
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

      fetchingPermissions: false,
      treeItems: [],
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
    async FetchEndpoints () {
      const app = this

      app.fetchingPermissions = true

      let modules = []
      let permissions = []

      let response = null

      // Fetch Modules
      response = await app.$api.ModuleService.List({
          pageSize: 1000,
          filterField: 'application',
          filterValue: app.formObject.application
        })
      if (response.success) {
        response.data.results.forEach(item => {
          modules.push(item)
        })
      }
      // Fetch Permissions
      response = await app.$api.EndpointService.List({
          pageSize: 1000,
          filterField: 'application',
          filterValue: app.formObject.application
        })
      if (response.success) {
        response.data.results.forEach(item => {
          permissions.push(item)
        })
      }

      // Modify property for display and value
      // compatibility with tree component
      permissions.forEach(perm => {
        perm.name = perm.permission
      })

      modules.forEach(mod => {
        mod.children = permissions.filter(a => a.module === mod.id)

        if (mod.parent) {
          let parentMod = modules.find(a => a.id === mod.parent)
          mod.parentCode = parentMod.code
        }
      })
      modules.forEach(mod => {
        mod.id = mod.code
      })

      // Group modules by parent
      let groupedModules = []

      var array = modules
      for (var i = 0; i < array.length; i++) {
        var parent = array[i].parentCode;
        if (!parent) {
          groupedModules.push(array[i]);
        }
        else {
          for (var j = 0; j < array.length; j++) {
            if (array[j].code === parent) {
              array[j].children = array[j].children || [];
              array[j].children.push(array[i]);
            }
          }
        }
      }

      app.treeItems = []

      groupedModules.forEach(item => {
        app.treeItems.push(item)
      })

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
      await app.FetchEndpoints()
      app.formObject.permissions = []
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
  async mounted () {
    const app = this
    app.slug = app.$route.params.id
    app.fetchingPermissions = true

    await app.FetchDetails()
    await app.FetchApplications()
    await app.FetchEndpoints()
  }


}
</script>

