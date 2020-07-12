<template>
  <viewComponent
    :name="'Permissions'"
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
        :value="formObject.service ? formObject.service.name : ''"
        label="Service Name"
        placeholder=" "
        readonly
      />
      <v-row>
        <v-col>
          <v-list dense rounded disabled>
            <v-subheader>Service Routes</v-subheader>
            <v-list-item-group color="primary">
              <template v-for="(item, i) in formObject.service_routes">
                <v-divider
                  v-if="!item"
                  :key="`divider-${i}`"
                ></v-divider>
                <v-list-item
                  v-else
                  :key="`item-${i}`"
                  :value="item.code"
                >
                  <template v-slot:default>
                    <v-list-item-action>
                      <v-list-item-title v-text="item.method"></v-list-item-title>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.url"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
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
    async Refresh () {
      const app = this
      await app.FetchDetails(this.slug)
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.PermissionService.View(app.slug)
      
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
