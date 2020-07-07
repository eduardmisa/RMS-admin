<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!updated">
      <v-system-bar color="primary" v-if="!loading"> <v-spacer></v-spacer> <v-icon></v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">Update {{name}}</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1">
          <v-btn color="primary" outlined icon @click="BackToList" class="mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <v-btn color="primary" outlined icon @click="Update" :disabled="!formValid"><v-icon>mdi-content-save</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        Update details of <br> this {{name}}
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <slot name="default"></slot>
    </v-card>

    <v-card v-else>
      <v-system-bar color="success" v-if="!loading"> <v-spacer></v-spacer> <v-icon></v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        {{name}} Updated
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>

      <v-card-subtitle>
        Updated details of <br> {{name}}
        <v-spacer></v-spacer>
        <v-switch hide-details label="Raw" v-model="showRaw"></v-switch>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-container class="pl-4 pr-4">
        <pre v-if="showRaw">{{formObject}}</pre>
        <div v-else>
          <div v-for="(val, key) in formObject" :key="key" class="mb-2">
            <span class="font-weight-medium primary--text body-2">{{key}}</span><br>
            <span class="font-regular body-1">{{val ? val : '&nbsp'}}</span>
            <v-divider class="mt-1"></v-divider>
          </div>
        </div>
      </v-container>
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
        type: Object
      },
      formValid: {
        type: Boolean
      },
      loading: {
        type: Boolean
      },
      updated: {
        type: Boolean
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
      FetchDetails () {
        this.$emit('onFetchDetails')
      },
      Update () {
        this.$emit('onUpdate')
      },
    }
  }
</script>

