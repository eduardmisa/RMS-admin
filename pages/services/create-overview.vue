<template>
  <div>
    <v-form v-model="formValid">
      <createComponent
        :name="'Service'"
        :formValid="formValid"
        :formObject="formObject"
        :loading="loading"
        :created="created"

        @onBack="BackToList"
        @onCreate="Create"
        :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start ma-2`"
      >
        <v-card-text>
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
        </v-card-text>
      </createComponent>
      <br>
      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <createFrontendRoutesComponent
          v-model="formObject.routes_fronts"
          :name="'Frontend Routes'"
          :tableHeaders="[
              { text: 'Url', value: 'url' },
              { text: 'Remove', value: 'actions', align: 'center' },
          ]"
          :formValid="formValid"
          @onFormValidity="formValid = $event"
          class="ma-2"
        />
        <createBackendRoutesComponent
          v-model="formObject.routes_backs"
          :name="'Backend Routes'"
          :tableHeaders="[
              { text: 'Method', value: 'method', width: 130 },
              { text: 'Url', value: 'url' },
              { text: 'Remove', value: 'actions', align: 'center' },
          ]"
          @onFormValidity="formValid = $event"
          class="ma-2"
        />
      </div>
      <br>
      <div :class="`${ this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg ? 'd-inline-flex' : ''} flex-nowrap align-start`">
        <createPermissionsComponent
          v-model="formObject.permissions"
          :name="'Permissions'"
          :tableHeaders="[
              { text: 'Name', value: 'name', },
              { text: 'Description', value: 'description' },
              { text: 'Remove', value: 'actions', align: 'center' },
          ]"
          :front_routes="formObject.routes_fronts"
          :back_routes="formObject.routes_backs"
          @onFormValidity="formValid = $event"
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
              { text: 'Remove', value: 'actions', align: 'center' },
          ]"
          :front_routes="formObject.routes_fronts"
          @onFormValidity="formValid = $event"
          class="ma-2"
        />
      </div>

    </v-form>
  </div>
</template>

<script>
import createComponent from "@/components/shared/crud/create"
import createFrontendRoutesComponent from "@/components/service-overview-create/frontend-route"
import createBackendRoutesComponent from "@/components/service-overview-create/backend-route"
import createPermissionsComponent from "@/components/service-overview-create/permission"
import createModuleComponent from "@/components/service-overview-create/module"

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

      // Build Form Here
      var body = JSON.parse(JSON.stringify(Object.assign({}, app.formObject))) 

      body.permissions.forEach(perm => {
        for (let i = 0; i < perm.routes_fronts.length; i++)
          perm.routes_fronts[i] = body.routes_fronts.find(a => a.id == perm.routes_fronts[i])
        for (let i = 0; i < perm.routes_backs.length; i++)
          perm.routes_backs[i] = body.routes_backs.find(a => a.id == perm.routes_backs[i])
      })

      body.modules.forEach(mod => {
        mod.routes_front = body.routes_fronts.find(a => a.id == mod.routes_front)

      })

      let response = await app.$api.ServiceService.CreateOverview(body)

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
      return this.$toast({message: errorData, color: 'error'})
    }
  },
  mounted () {
    this.formObject.id = this.$helpers.guid.generateGUID()
    this.formObject.description = ""
  }
}
</script>

