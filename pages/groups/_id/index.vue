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
      <v-row>
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
      </v-row>
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

      fetchingPermissions: false,
      treeItems: [],
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
    await app.FetchEndpoints()
  }
}
</script>

