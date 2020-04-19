<template>
  <updateComponent
    :name="'Module'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :updated="updated"

    @onBack="BackToList"
    @onFetchDetails="FetchDetails"
    @onUpdate="Update"
  >
    <v-form v-model="formValid">
      <v-text-field
        v-model="formObject.name"
        label="Name"
        :rules="[v => !!v || 'Name is required']"
      />
      <v-text-field
        v-model="formObject.description"
        label="Description"
      />
      <v-text-field
        v-model="formObject.front_icon"
        label="Front Icon"
      />
      <v-text-field
        v-model="formObject.front_url"
        label="Fron Url"
      />

      <v-text-field
        v-model="formObject.application"
        label="Application"
        :rules="[v => !!v || 'Base url is required']"
      />
      <v-text-field
        v-model="formObject.parent"
        label="Parent"
      />
      
    </v-form>
  </updateComponent>
</template>

<script>
import updateComponent from "@/components/shared/crud/update"

export default {
  components: {
    updateComponent
  },
  data () {
    return {
      slug: null,
      loading: false,
      formObject: {},
      formValid: false,
      updated: false
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.ModuleService.View(this.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Update () {
      const app = this

      app.loading = true

      let response = await app.$api.ModuleService.Update(this.slug, app.formObject)

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
      app.updated = true
      app.formObject = Object.assign({}, data)
    },
    HandleFormError (errorData) {
      const app = this
      if (errorData) {

        let formError = false
        Object.keys(errorData).forEach(errorDataKey => {
          if (Object.keys(app.formObject).includes(errorDataKey)) {
            formError = true
          }
        })

        if (formError) {
          Object.keys(app.formObject).forEach(formKey => {
            delete app.formObject[`${formKey}_error`]
          })

          Object.keys(app.formObject).forEach(formKey => {
            if (Object.keys(errorData).includes(formKey)) {
              app.formObject[`${formKey}_error`] = errorData[formKey]
            }
          })

          return
        }
      }

      return app.$toast({message: errorData, color: 'error'})
    }
  },
  created () {
    this.slug = this.$route.params.id
    this.FetchDetails()
  }


}
</script>

