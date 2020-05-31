<template>
  <div>
    <!-- <pre>{{formObject}}</pre> -->
    <createComponent
      :name="'Application'"
      :formValid="formValid"
      :formObject="formObject"
      :loading="loading"
      :created="created"

      @onBack="BackToList"
      @onCreate="Create"
      class="ma-2 shrink align-start"
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

    <div class="d-flex flex-column">
      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <createFrontendRoutesComponent
          v-model="formObject.routes_fronts"
          :name="'Frontend Routes'"
          :tableHeaders="[
              { text: 'Url', value: 'url' },
              { text: 'Action', value: 'actions', align: 'center' },
          ]"
          class="ma-2"
        />
        <createBackendRoutesComponent
          v-model="formObject.routes_backs"
          :name="'Backend Routes'"
          :tableHeaders="[
              { text: 'Method', value: 'method', width: 130 },
              { text: 'Url', value: 'url' },
              { text: 'Action', value: 'actions', align: 'center' },
          ]"
          class="ma-2"
        />
      </div>

      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <createPermissionsComponent
          v-model="formObject.permissions"
          :name="'Permissions'"
          :tableHeaders="[
              { text: 'Name', value: 'name', },
              { text: 'Description', value: 'description' },
              { text: 'Action', value: 'actions', align: 'center' },
          ]"
          :front_routes="formObject.routes_fronts"
          :back_routes="formObject.routes_backs"
          class="ma-2"
        />
        <createModuleComponent
          v-model="formObject.modules"
          :name="'Modules'"
          :tableHeaders="[
              { text: 'Name', value: 'name', },
              { text: 'Description', value: 'description' },
              { text: 'Icon', value: 'icon' },
              { text: 'Parent', value: 'parent' },
              { text: 'Frontend Route', value: 'routes_front' },
              { text: 'Action', value: 'actions', align: 'center' },
          ]"
          :front_routes="formObject.routes_fronts"
          class="ma-2"
        />
      </div>
    </div>

  </div>
</template>

<script>
import createComponent from "@/components/shared/crud/create"
import createFrontendRoutesComponent from "@/components/application-overview-create/frontend-route"
import createBackendRoutesComponent from "@/components/application-overview-create/backend-route"
import createPermissionsComponent from "@/components/application-overview-create/permission"
import createModuleComponent from "@/components/application-overview-create/module"

export default {
  components: {
    createComponent,
    createFrontendRoutesComponent,
    createBackendRoutesComponent,
    createPermissionsComponent,
    createModuleComponent
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

      let response = await app.$api.ApplicationService.CreateOverview(app.formObject)

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

      return app.$toast({message: errorData, color: 'error'})
    }
  }
}
</script>

