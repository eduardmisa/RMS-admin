<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!updated">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi mdi-file-cloud</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Update Module
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Update"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Update details of this module
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-for="key in Object.keys(details)" :key="key"
          :value="details[key]"
          @input="details[key]=$event"
          :label="key"
          hide-details
          class="mb-4"
        />
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi mdi-file-cloud</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Module Updated
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>

      <v-card-subtitle>
        Updated details of <br> module
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
    data () {
      return {
        loading: false,
        details: {},
        showRaw: false,
        updated: false,
      }
    },
    mounted () {
      const app = this

      app.FetchDetails(app.$route.params.id)
      .then(function () {
        let sch = new app.$modelSchema.Module()
        sch.clear()
        Object.keys(sch).forEach(key => {
          sch[key] = app.details[key]
        })
        app.details = sch
      })
    },
    methods: {
      async FetchDetails (id) {
        const app = this

        app.loading = true

        let response = await app.$api.ModuleService.View(id)
        
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
        this.$router.push(`/modules/`)
      },
      Refresh () {
        this.FetchDetails(this.$route.params.id)
      },
      async Update () {
        const app = this

        app.loading = true

        let response = await app.$api.ModuleService.Update(this.$route.params.id, app.details)

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

