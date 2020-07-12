<template>
  <createComponent
    :name="'User'"
    :formValid="formValid"
    :formObject="formObject"
    :loading="loading"
    :created="created"

    @onBack="BackToList"
    @onCreate="Create"
  >
    <v-form v-model="formValid">

      <v-stepper v-model="e1" class="elevation-0">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Personal Details</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Account Credentials</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">Groups &amp; Permissions</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">

            <v-container>
              <v-form v-model="step1Passes">
                <v-text-field
                  v-model="formObject.firstname"
                  label="Firstname"
                  :rules="[v => !!v || 'Firstname is required']"
                />
                <v-text-field
                  v-model="formObject.middlename"
                  label="Middlename"
                />
                <v-text-field
                  v-model="formObject.lastname"
                  label="Lastname"
                  :rules="[v => !!v || 'Firstname is required']"
                />
                <v-dialog
                  ref="dialog"
                  v-model="dateMenu"
                  :return-value.sync="formObject.birthdate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="formObject.birthdate"
                      label="Birthdate"
                      readonly
                      v-on="on"
                      :rules="[v => !!v || 'Birthdate is required']"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="formObject.birthdate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(formObject.birthdate)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-form>
            </v-container>

            <v-layout>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!step1Passes"
                color="primary"
                @click="e1 = 2"
              >
                Continue
              </v-btn>
            </v-layout>

          </v-stepper-content>

          <v-stepper-content step="2">

            <v-container>
              <v-form v-model="step2Passes">
                <v-text-field
                  v-model="formObject.email"
                  label="Email"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'E-mail must be valid'  ]"
                />
                <v-text-field
                  v-model="formObject.username"
                  label="Username"
                  :rules="[v => !!v || 'Username is required']"
                />
                <v-text-field
                  v-model="formObject.password"
                  label="Password"
                  :rules="[v => !!v || 'Password is required']"
                  type="password"
                />
              </v-form>
            </v-container>

            <v-layout>
              <v-btn
                color="secondary"
                @click="e1 = 1"
              >
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!step2Passes"
                color="primary"
                @click="e1 = 3"
              >
                Continue
              </v-btn>
            </v-layout>
          </v-stepper-content>

          <v-stepper-content step="3">

            <v-container>
              <v-form>

                <v-combobox
                  v-model="selectedApps"
                  :loading="fetchingServices"
                  :items="services"
                  item-text="name"
                  item-value="code"
                  @change="FetchGroups"
                  label="Service"
                  multiple
                  chips
                  hint="Groups will be filtered by service"
                  persistent-hint
                  :rules="[v => (selectedApps || []).length > 0 || 'Service is required']"
                ></v-combobox>

                <br>
                <span class="subtitle-1 font-weight-bold primary--text">Groups</span>
                <span class="overline error--text" v-if="(formObject.groups || []).length == 0">| Please select atleast one(1) group</span>
                <v-checkbox
                  v-for="item in groups" :key="item.code"
                  v-model="formObject.groups"
                  :label="item.name"
                  :value="item.code"
                  multiple
                  hide-details
                  class="mt-0"
                />
                <br>
              </v-form>
            </v-container>

            <v-layout>
              <v-btn
                color="secondary"
                @click="e1 = 2"
              >
                Back
              </v-btn>
              <v-spacer></v-spacer>
            </v-layout>
          </v-stepper-content>

        </v-stepper-items>
      </v-stepper>
    </v-form>
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
      formObject: { groups: [] },
      // formValid: false,
      created: false,

      dateMenu: false,

      selectedApps: [],
      fetchingServices: false,
      services: [],

      fetchingGroups: false,
      groups: [],

      e1: 1,
      step1Passes: false,
      step2Passes: false,
      // step3Passes: false,
    }
  },
  computed: {
    step3Passes () {
      return this.selectedApps.length > 0 && (this.formObject.groups || []).length > 0
    },
    formValid () {
      return this.step1Passes && this.step2Passes && this.step3Passes
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
        })
      }
      
      app.fetchingServices = false
    },
    async FetchGroups () {
      const app = this

      app.fetchingGroups = true

      app.formObject.groups = []
      app.groups = []

      let appIds = app.selectedApps.map(a => { return a.code })
      if (appIds.length <= 0) return

      let response = await app.$api.GroupService.List(
        {pageSize: 1000,
        filterField: 'services',
        filterValue: appIds.join(',')})

      if (response.success) {
        response.data.results.forEach(item => {
          app.groups.push(item)
        })
      }
      
      app.fetchingGroups = false
    },
    async Create () {
      const app = this

      app.loading = true

      let response = await app.$api.UserService.Create(app.formObject)

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

      try { app.$toast({message: ("detail" in errorData) ? errorData.detail : errorData, color: 'error'}) } catch { app.$toast({message: 'Failed to delete', color: 'error'}) }
    }
  },
  mounted () {
    this.FetchServices()
  }
}
</script>

