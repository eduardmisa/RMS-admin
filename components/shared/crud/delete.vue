<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card :loading="loading" v-if="!deleted">
      <v-system-bar color="error" v-if="!loading"> <v-spacer></v-spacer> <v-icon>-disabled</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        <span class="mr-3">Delete {{name}}</span>
        <v-spacer></v-spacer>
        <div class="mt-2 mb-1">
          <v-btn color="primary" outlined icon @click="BackToList" class="mr-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <v-btn color="primary" outlined icon @click="Delete"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        Are you sure you want <br> to delete this item?
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
            <div v-for="(val, key) in formObject" :key="key" class="mb-2">
              <span class="font-weight-medium primary--text body-2">{{key}}</span><br>
              <span class="font-regular body-1">{{val ? val : '&nbsp'}}</span>
              <v-divider class="mt-1"></v-divider>
            </div>
          </div>
        </v-container>
      </div>
    </v-card>

    <v-card v-else>
      <v-system-bar color="error" v-if="!loading"> <v-spacer></v-spacer> <v-icon>-disabled</v-icon> <v-spacer></v-spacer> </v-system-bar>
      <v-card-title>
        {{name}} Deleted
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined icon @click="BackToList" class="ml-3"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        Details removed from <br> the database
        <v-spacer></v-spacer>
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-layout
          column
          justify-center
          align-center
        >
          <v-icon color="primary">mdi-delete</v-icon>
        </v-layout>
      </v-card-text>
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
      deleted: {
        type: Boolean
      },      
    },
    data () {
      return {
        showRaw: false
      }
    },
    methods: {
      BackToList () {
        this.$emit('onBack')
      },
      FetchDetails () {
        this.$emit('onFetchDetails')
      },
      Delete () {
        this.$emit('onDelete')
      }
    }
  }
</script>

