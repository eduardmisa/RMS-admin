<template>
  <viewComponent
    :name="'Group'"
    :formObject="formObject"
    :loading="loading"

    @onBack="BackToList"
    @onRefresh="Refresh"
    @onFetchDetails="FetchDetails"
  >
    <div>
      <v-form>
        <v-text-field
          :value="formObject.code"
          label="Code"
          placeholder=" "
          readonly
        />
        <v-row>
          <v-col>
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
          </v-col>
          <v-col>
            <v-text-field
              :value="formObject.service ? formObject.service.name : ''"
              label="Service"
              placeholder=" "
              readonly
            />
            <v-checkbox
              :value="formObject.has_all_access"
              label="Has all access"
              placeholder=" "
              readonly
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="!formObject.has_all_access">
              <v-list dense rounded disabled>
                <v-subheader>Permissions</v-subheader>
                <v-list-item-group color="primary">
                  <template v-for="(item, i) in formObject.permissions">
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
                        <v-list-item-content>
                          <v-list-item-title v-text="item.name"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </div>  
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
      formObject: {}
    }
  },
  methods: {
    BackToList () {
      this.$router.back()
    },
    Refresh () {
      this.FetchDetails()
    },
    async FetchDetails () {
      const app = this

      app.loading = true

      let response = await app.$api.GroupService.View(app.slug)
      
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
    const app = this
    app.slug = app.$route.params.id
    
    await app.FetchDetails()
  }
}
</script>

