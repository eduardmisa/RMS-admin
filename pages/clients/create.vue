<template>
  <createComponent
    :name="'Client'"
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
          v-model="formObject.application"
          label="Application"
          :loading="fetchingApplications"
          :items="applications"
          item-text="name"
          item-value="code"
          :rules="[v => !!v || 'Application is required']"
        />

        <v-combobox
          v-model="formObject.applications"
          :loading="fetchingApplications"
          :items="externalApplications"
          item-text="name"
          item-value="code"
          label="External Application"
          multiple
          chips
        ></v-combobox>
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
      created: false,

      dateMenu: false,

      fetchingApplications: false,
      applications: [],
      externalApplications: [],
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    async FetchApplications () {
      const app = this

      app.fetchingApplications = true

      let response = await app.$api.ApplicationService.List({pageSize: 1000})

      app.applications = []

      if (response.success) {
        response.data.results.forEach(item => {
          app.applications.push(item)
          app.externalApplications.push(item)
        })
      }
      
      app.fetchingApplications = false
    },
    async Create () {
      const app = this

      app.loading = true

      app.formObject.applications = app.formObject.applications.map(a => {  return a.code })

      let response = await app.$api.ClientService.Create(app.formObject)

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

      return app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error', color: 'error'})
    }
  },
  mounted () {
    this.FetchApplications()
  }
}
</script>

