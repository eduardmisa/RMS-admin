<template>
  <listComponent
    :name="'Modules'"
    :loading="loading"
    :tableData="tableData"
    :tableHeaders="tableHeaders"

    @onRefresh="Refresh"
    @onView="View"
    @onCreate="Create"
    @onUpdate="Update"
    @onDelete="Delete"
  />
</template>

<script>
import listComponent from "@/components/shared/crud/list"

export default {
  components: {
    listComponent
  },
  data () {
    return {
      loading: false,
      tableData: [],
      tableHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Icon', value: 'icon' },
          { text: 'Parent', value: 'parent' },
          { text: 'Route', value: 'route' },
          { text: 'Service', value: 'service' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: 125 },
      ]
    }
  },
  methods: {
    async Refresh () {
      const app = this

      app.loading = true

      let response = await app.$api.ModuleService.List({pageSize: 1000})

      app.tableData = []
      app.tableSearch = null

      if (response.success) 
        app.HandleListSuccessResponse(response.data)
      else
        app.HandleListErrorResponse(response.error)
      
      app.loading = false
    },
    View (item) {
      this.$router.push(`/modules/${item.code}/`)
    },
    Create () {
      this.$router.push(`/modules/create/`)
    },
    Update (item) {
      this.$router.push(`/modules/${item.code}/update/`)
    },
    Delete (item) {
      this.$router.push(`/modules/${item.code}/delete/`)
    },


    // API RESPONSE HANDLERS
    HandleListSuccessResponse (data) {
      const app = this
        data.results.forEach(item => {
          app.tableData.push(item)
        })
    },
    HandleListErrorResponse (error) {
      const app = this
      app.$toast({message: error, color: 'error'})
    },
  },
  mounted () {
    this.Refresh()
  }
}
</script>

