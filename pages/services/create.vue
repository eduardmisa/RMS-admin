<template>
  <createComponent
    :name="'Service'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :created="created"

    @onBack="BackToList"
    @onCreate="Create"
  >
    <v-card-text>
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
          v-model="formObject.base_url"
          label="Base url"
          :rules="[v => !!v || 'Base url is required']"
        />
      </v-form>
    </v-card-text>
  </createComponent>
</template>

<script>
import createComponent from "@/components/shared/crud/create"

export default {
  components: {
    createComponent
  },
  data () {
    return {
      loading: false,
      formObject: {},
      formValid: false,
      created: false
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async Create () {
      const app = this

      app.loading = true

      let response = await app.$api.ServiceService.Create(app.formObject)

      if (response.success)
        app.HandleFormSuccess(response.data)
      else
        app.HandleFormError(response.error)

      app.loading = false
    },


    // API RESPONSE HANDLERS
    HandleFormSuccess (data) {
      const app = this
      app.created = true
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

      return app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'})
    }
  }
}
</script>

