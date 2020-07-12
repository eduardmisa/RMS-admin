<template>
  <deleteComponent
    :name="'Permissions'"
    :formObject="formObject"
    :loading="loading"
    :deleted="deleted"

    @onBack="BackToList"
    @onFetchDetails="FetchDetails"
    @onDelete="Delete"
  />
</template>

<script>
import deleteComponent from "@/components/shared/crud/delete"

export default {
  components: {
    deleteComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},
      deleted: false
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.PermissionService.View(app.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Delete () {
      const app = this

      app.loading = true

      let response = await app.$api.PermissionService.Delete(app.slug)
      
      if (response.success)
        app.HandleFormSuccess(response.data)
      else
        app.HandleFormError(response.error)

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

    HandleFormSuccess (data) {
      const app = this
      app.deleted = true
    },
    HandleFormError (errorData) {
      const app = this
      try { app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}) } catch { app.$toast({message: 'Failed to delete', color: 'error'}) }
    }
  },
  mounted () {
    this.slug = this.$route.params.id
    this.FetchDetails()
  }
}
</script>

