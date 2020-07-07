<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon>-disabled</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">{{name}} Details</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1" v-if="!noAction">
          <v-btn color="primary" outlined icon @click="BackToList" class="mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <v-btn color="primary" outlined icon @click="Refresh"><v-icon>mdi-refresh</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        Information of {{name}}
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <div>
        <div v-if="loading">
          <v-skeleton-loader
            v-for="i in 5" :key="i"
            tile
            :type="'list-item-three-line'"
            class="mx-auto"
          />
        </div>
        <v-container class="pl-4 pr-4" v-else>
          <pre v-if="showRaw">{{formObject}}</pre>
          <div v-else>
            <slot name="default"/>
          </div>
        </v-container>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
      formObject: {
        type: Object,
        required: true
      },
      loading: {
        type: Boolean
      },
      noAction: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        showRaw: false,
      }
    },
    methods: {
      BackToList () {
        this.$emit('onBack')
      },
      Refresh () {
        this.$emit('onRefresh')
      },
      FetchDetails () {
        this.$emit('onFetchDetails')
      },
    }
  }
</script>
