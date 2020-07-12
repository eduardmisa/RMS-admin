<template>
  <div :class="`${$vuetify.breakpoint.xl ? 'd-flex' : '' } align-start`">
    <viewComponent
      :name="'Overview'"
      :formObject="appDetails"
      :loading="loading"

      @onBack="BackToList"
      @onRefresh="Refresh"
      @onFetchDetails="FetchDetails"
      class="ma-2 grow"
    >
      <div>
        <v-text-field
          v-model="appDetails.name"
          label="Name"
          disabled
        />
        <v-text-field
          v-model="appDetails.description"
          label="Description"
          disabled
        />
        <v-text-field
          v-model="appDetails.base_url"
          label="Base Url"
          disabled
        />
      </div>  
    </viewComponent>

    <div class="d-flex flex-column">

      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <listComponent
          noAction
          :name="'Frontend Routes'"
          :loading="loading"
          :tableData="appRoutes.routes_fronts"
          :tableHeaders="[
              { text: 'Url', value: 'url' }
          ]"
          class="ma-2"
        />
        <listComponent
          noAction
          :name="'Backend Routes'"
          :loading="loading"
          :tableData="appRoutes.routes_backs"
          :tableHeaders="[
              { text: 'Method', value: 'method' },
              { text: 'Url', value: 'url' }
          ]"
          class="ma-2"
        />
      </div>

      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <listExpandPermissionsComponent
          noAction
          :name="'Permissions'"
          :loading="loading"
          :tableData="appPermissions.permissions"
          :tableHeaders="[
              { text: 'Name', value: 'name' }
          ]"
          class="ma-2"
        />
        <listExpandModulesComponent
          noAction
          :name="'Modules'"
          :loading="loading"
          :tableData="appModules.modules"
          :tableHeaders="[
              { text: 'Name', value: 'name' }
          ]"
          class="ma-2"
        />
      </div>

    </div>

  </div>
</template>

<script>
import viewComponent from "@/components/shared/crud/view"
import listComponent from "@/components/shared/crud/list"
import listExpandPermissionsComponent from "@/components/service-overview/list-expand-permissions"
import listExpandModulesComponent from "@/components/service-overview/list-expand-modules"
import moduleListComponent from "@/components/shared/crud/list"

export default {
  components: {
    viewComponent,
    listComponent,
    listExpandPermissionsComponent,
    listExpandModulesComponent,
    moduleListComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},
    }
  },
  computed: {
    appDetails () {
      var instance = Object.assign({}, this.formObject)
      delete instance.routes_fronts
      delete instance.routes_backs
      delete instance.permissions
      delete instance.modules

      return instance
    },
    appRoutes () {
      var instance = {}
      instance.routes_fronts = Object.assign([], this.formObject.routes_fronts)
      instance.routes_backs = Object.assign([], this.formObject.routes_backs)
      return instance
    },
    appPermissions () {
      var instance = {}
      instance.permissions = Object.assign([], this.formObject.permissions)
      return instance
    },
    appModules () {
      var instance = {}
      var result = []
      var array = Object.assign([], this.formObject.modules)
      for (var i = 0; i < array.length; i++) {
        var parent = array[i].parent_id;
        if (!parent) {
          result.push(array[i]);
        } else {
          // You'll want to replace this with a more efficient search
          for (var j = 0; j < array.length; j++) {
            if (array[j].id === parent) {
              array[j].subModules = array[j].subModules || [];
              array[j].subModules.push(array[i]);
              break;
            }
          }
        }
      }
      instance.modules = result
      return instance
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    Refresh () {
      this.FetchDetails(this.slug)
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.ServiceService.Overview(app.slug)
      
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
    this.slug = this.$route.params.id
    await this.Refresh()
  }
}
</script>

