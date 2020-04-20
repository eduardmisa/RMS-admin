<template>
  <viewComponent
    :name="'User'"
    :formObject="formObject"
    :loading="loading"

    @onBack="BackToList"
    @onRefresh="Refresh"
    @onFetchDetails="FetchDetails"
  >
    <div>
      <div v-for="(val, key) in formObject" :key="key" class="mb-2">
        <span class="font-weight-medium primary--text body-2">{{key}}</span><br>
        <span class="font-regular body-1">{{val ? val : '&nbsp'}}</span>
        <v-divider class="mt-1"></v-divider>
      </div>
    </div>  
  </viewComponent>
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

      let response = await app.$api.UserService.View(app.slug)
      
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

