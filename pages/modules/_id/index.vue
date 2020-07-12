<template>
  <viewComponent
    :name="'Module'"
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
        :value="formObject.icon"
        label="Icon"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.parent ? formObject.parent.name : ''"
        label="Parent"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.service? formObject.service.name : ''"
        label="Service"
        placeholder=" "
        readonly
      />

      <v-text-field
        :value="formObject.route ? formObject.route.method : ''"
        label="Url"
        placeholder=" "
        readonly
      />
      <v-text-field
        :value="formObject.route ? formObject.route.url : ''"
        label="Url"
        placeholder=" "
        readonly
      />
    </v-form>
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

      let response = await app.$api.ModuleService.View(app.slug)
      
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
  mounted () {
    this.slug = this.$route.params.id
    this.Refresh()
  }
}
</script>

