<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!created">
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon>mdi mdi-file-cloud</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        Create Module
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3 mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
        <v-btn color="primary" outlined icon @click="Create"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Fill fields below
        <v-spacer></v-spacer>
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
        Module Created
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Saved details of <br> module
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
        created: false,
      }
    },
    mounted () {
      this.details = new this.$modelSchema.Module()
      this.details.clear()
    },
    methods: {
      BackToList () {
        this.$router.push(`/modules/`)
      },
      async Create () {
        const app = this

        app.loading = true

        let response = await app.$api.ModuleService.Create(app.details)

        if (response.success) {
          app.created = true
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

