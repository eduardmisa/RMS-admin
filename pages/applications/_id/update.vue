<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!updated">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Application Details
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Update"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-card-title>

      <v-card-subtitle>
        Information of application
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-model="details.name"
          label="Name"
          hide-details
          class="mb-4"
        />
        <v-text-field
          v-model="details.description"
          label="Description"
          hide-details
          class="mb-4"
        />
        <v-text-field
          v-model="details.base_url"
          label="Base url"
          hide-details
          class="mb-4"
        />
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi-cloud-braces</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Application Updated
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>

      <v-card-subtitle>
        Updated details of <br> application
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>

        <div v-for="(val, key) in details" :key="key" class="mb-4">
          <v-text-field
            :label="key"
            :value="val"
            hide-details
            disabled
          />
        </div>

      </v-card-text>
    </v-card>



  </v-layout>
</template>

<script>
  export default {
  transition (to, from) {
    if (!from) { return 'slide-left' }
    return +to.query.page < +from.query.page ? 'slide-right' : 'slide-left'
  },
    data () {
      return {
        loading: false,
        details: {},
        showRaw: false,
        updated: false,
      }
    },
    async mounted () {
      this.FetchDetails(this.$route.params.id)
    },
    methods: {
      async FetchDetails (id) {
        const app = this

        app.loading = true

        let response = await app.$api.ApplicationService.View(id)
        
        if (response.success) {
          app.details = {}
          app.details = Object.assign({}, response.data)
        }
        else {
          alert(response.error)
        }
        app.loading = false
      },
      BackToList () {
        this.$router.push(`/applications/`)
      },
      Refresh () {
        this.FetchDetails(this.$route.params.id)
      },
      async Update () {
        const app = this

        app.loading = true

        let response = await app.$api.ApplicationService.Update(this.$route.params.id, app.details)

        if (response.success) {
          app.updated = true
          app.details = Object.assign({}, response.data)
        }
        else {
          alert(response.error)
        }
        app.loading = false
      }
    }
  }
</script>

