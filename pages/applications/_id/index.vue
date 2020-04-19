<template>
  <v-row>
    <v-col>
      <viewComponent
        :name="'Application'"
        :formObject="formObject"
        :loading="loading"

        @onBack="BackToList"
        @onRefresh="Refresh"
        @onFetchDetails="FetchDetails"
      />
    </v-col>

    <v-col>
      <moduleListComponent
        :name="'Modules'"
        :loading="moduleLoading"
        :tableData="moduleTableData"
        :tableHeaders="moduleTableHeaders"

        @onRefresh="moduleRefresh"
        @onView="moduleView"
        @onCreate="moduleCreate"
        @onUpdate="moduleUpdate"
        @onDelete="moduleDelete"
      />
    </v-col>
  </v-row>

</template>

<script>
import viewComponent from "@/components/shared/crud/view"
import moduleListComponent from "@/components/shared/crud/list"

export default {
  components: {
    viewComponent,
    moduleListComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},

      // MODULE
      moduleLoading: false,
      moduleTableData: [],
      moduleTableHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Front Icon', value: 'front_icon' },
          { text: 'Fron Url', value: 'front_url' },
          { text: 'Application', value: 'application' },
          { text: 'Parent', value: 'parent' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: 125 }
        ],
    }
  },
  methods: {
    // APPLICATION
    BackToList () {
      this.$router.back()
    },
    Refresh () {
      this.FetchDetails(this.slug)
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.ApplicationService.View(app.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },


    // APPLICATION - API RESPONSE HANDLERS
    HandleFetchSuccessResponse (data) {
      const app = this
      app.formObject = {}
      app.formObject = Object.assign({}, data)
    },
    HandleFetchErrorResponse (error) {
      const app = this
      app.$toast({message: error, color: 'error'})
    },


    // MODULES
    async moduleRefresh () {
      const app = this

      app.moduleLoading = true

      let response = await app.$api.ModuleService.List({pageSize: 1000, filterField: 'application', filterValue: app.slug})

      app.moduleTableData = []
      
      if (response.success) 
        app.HandleListSuccessResponse(response.data)
      else
        app.HandleListErrorResponse(response.error)
      
      app.moduleLoading = false
    },
    moduleView (item) {
      this.$router.push(`/modules/${item.id}/`)
    },
    moduleCreate () {
      this.$router.push(`/modules/create/`)
    },
    moduleUpdate (item) {
      this.$router.push(`/modules/${item.id}/update/`)
    },
    moduleDelete (item) {
      this.$router.push(`/modules/${item.id}/delete/`)
    },


    // MODULES - API RESPONSE HANDLERS
    HandleListSuccessResponse (data) {
      const app = this
        data.results.forEach(item => {
          app.moduleTableData.push(item)
        })
    },
    HandleListErrorResponse (error) {
      const app = this
      app.$toast({message: error, color: 'error'})
    },
  },
  created () {
    this.slug = this.$route.params.id
    this.Refresh()
    this.moduleRefresh()
  }
}
</script>

