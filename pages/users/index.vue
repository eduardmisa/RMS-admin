<template>
  <listComponent
    :name="'Users'"
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
          { text: 'Username', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Firstname', value: 'firstname' },
          { text: 'Middlename', value: 'middlename' },
          { text: 'Lastname', value: 'lastname' },
          { text: 'Birthdate', value: 'birthdate' },
          { text: 'Active', value: 'is_active' },
          { text: 'Superuser', value: 'is_superuser' },
          { text: 'Groups', value: 'groups' },

          { text: 'Actions', value: 'actions', sortable: false, align: 'center', width: 125 },
      ]
    }
  },
  methods: {
    async Refresh () {
      const app = this

      app.loading = true

      let response = await app.$api.UserService.List({pageSize: 1000})

      app.tableData = []
      app.tableSearch = null

      if (response.success) 
        app.HandleListSuccessResponse(response.data)
      else
        app.HandleListErrorResponse(response.error)
      
      app.loading = false
    },
    View (item) {
      this.$router.push(`/users/${item.code}/`)
    },
    Create () {
      this.$router.push(`/users/create/`)
    },
    Update (item) {
      this.$router.push(`/users/${item.code}/update/`)
    },
    Delete (item) {
      this.$router.push(`/users/${item.code}/delete/`)
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

