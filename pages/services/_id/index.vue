<template>
  <viewComponent
    :name="'Service'"
    :formObject="formObject"
    :loading="loading"

    @onBack="BackToList"
    @onRefresh="Refresh"
    @onFetchDetails="FetchDetails"
  >
    <v-form>
      <v-text-field
        :value="formObject.code"
        label="Code"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.name"
        label="Name"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.description"
        label="Description"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.base_url"
        label="Base url"
        placeholder=" "
        readonly
      />
    </v-form>
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

      let response = await app.$api.ServiceService.View(app.slug)
      
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

