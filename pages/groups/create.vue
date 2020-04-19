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
      await app.FetchEndpoints()
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


