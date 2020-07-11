<template>
  <listComponent
    :name="'Services'"
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
  asyncData () {
    return {
      loading: false,
      tableData: [],
      tableHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Base Url', value: 'base_url' },
          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: 125 },
      ]
    }
  },
  methods: {
    async Refresh () {
      const app = this

      app.loading = true

      let response = await app.$api.ServiceService.List({pageSize: 1000})

      app.tableData = []
      app.tableSearch = null

      if (response.success) 
        app.HandleListSuccessResponse(response.data)
      else
        app.HandleListErrorResponse(response.error)
      
      app.loading = false
    },
    View (item) {
      this.$router.push(`/services/${item.code}/`)
    },
    Create () {
      this.$router.push(`/services/create/`)
    },
    Update (item) {
      this.$router.push(`/services/${item.code}/update/`)
    },
    Delete (item) {
      this.$router.push(`/services/${item.code}/delete/`)
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

