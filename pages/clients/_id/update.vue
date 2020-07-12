<template>
  <updateComponent
    :name="'Client'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :updated="updated"

    @onBack="BackToList"
    @onFetchDetails="FetchDetails"
    @onUpdate="Update"
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

        <v-dialog
          ref="dialog"
          v-model="dateMenu"
          :return-value.sync="formObject.valid_until"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="formObject.valid_until"
              label="Valid Until"
              readonly
              v-on="on"
              :rules="[v => !!v || 'Valid Until is required']"
            ></v-text-field>
          </template>
          <v-date-picker v-model="formObject.valid_until" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(formObject.valid_until)">OK</v-btn>
          </v-date-picker>
        </v-dialog>


        <v-autocomplete
          v-model="formObject.service"
          label="Service"
          :loading="fetchingServices"
          :items="services"
          item-text="name"
          item-value="code"
          :rules="[v => !!v || 'Service is required']"
        />

        <v-combobox
          v-model="formObject.services"
          :loading="fetchingServices"
          :items="externalApplications"
          item-text="name"
          item-value="code"
          label="External Service"
          multiple
          chips
        ></v-combobox>
      </v-form>
    </v-card-text>
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
      loading: false,
      formObject: {},
      formValid: false,
      updated: false,

      dateMenu: false,

      fetchingServices: false,
      services: [],
      externalApplications: [],
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchServices () {
      const app = this

      app.fetchingServices = true

      let response = await app.$api.ServiceService.List({pageSize: 1000})

      app.services = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.services.push(item)
          app.externalApplications.push(item)
        })
      }
      
      app.fetchingServices = false
    },    
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.ClientService.View(this.slug)
      
      if (response.success)
        app.HandleFetchSuccessResponse(response.data)
      else
        app.HandleFetchErrorResponse(response.error)

      app.loading = false
    },
    async Update () {
      const app = this

      app.loading = true

      app.formObject.services = app.formObject.services.map(a => {  return a.code })

      let response = await app.$api.ClientService.Update(this.slug, app.formObject)

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

      let mapped = app.formObject.services.map(savedAppId => {
        return app.externalApplications.find(a => a.code === savedAppId.code)
      })
      app.formObject.services = []
      mapped.forEach(item => { app.formObject.services.push(item) })

      app.formObject.service = app.formObject.service.code
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

      try { app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}) } catch { app.$toast({message: 'Failed to delete', color: 'error'}) }
    }
  },
  async mounted () {
    const app = this
    app.slug = app.$route.params.id
    await app.FetchServices()
    await app.FetchDetails()
  }
}
</script>

