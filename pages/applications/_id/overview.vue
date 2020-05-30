<template>
  <div :class="`${$vuetify.breakpoint.xl ? 'd-flex' : '' } align-start align-content-start`">
    <viewComponent
      :name="'Overview'"
      :formObject="appDetails"
      :loading="loading"

      @onBack="BackToList"
      @onRefresh="Refresh"
      @onFetchDetails="FetchDetails"
      class="ma-2"
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

    <listComponent
      noAction
      :name="'Permissions'"
      :loading="loading"
      :tableData="appPermissions.permissions"
      :tableHeaders="[
          { text: 'Name', value: 'name' }
      ]"
      class="ma-2"
    />

    <listComponent
      noAction
      :name="'Modules'"
      :loading="loading"
      :tableData="appModules.modules"
      :tableHeaders="[
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' }
      ]"
      class="ma-2"
    />



  </div>
</template>

<script>
import viewComponent from "@/components/shared/crud/view"
import listComponent from "@/components/shared/crud/list"
import moduleListComponent from "@/components/shared/crud/list"

export default {
  components: {
    viewComponent,
    listComponent,
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
      instance.modules = Object.assign([], this.formObject.modules)
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

      let response = await app.$api.ApplicationService.Overview(app.slug)
      
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

