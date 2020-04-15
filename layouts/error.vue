<template>
  <v-app dark>
    <v-layout
      column
      justify-center
      align-center
    >
      <v-icon x-large color="primary">mdi-cloud-off-outline</v-icon>
      <h1>
        {{ errorMessage }}
      </h1>
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    // You are not allowed to view this page
    return {
      pageNotFound: '404 Not Found',
      pageNotAllowed: '403 Forbidden',
      pageOtherError: 'Error',
      errorMessage: 'An error occurred'
    }
  },
  head () {
    let app = this
    let title = null

    switch (app.error.statusCode) {
      
      case 404:
        title = app.pageNotFound
        app.errorMessage = 'Page could not be found'
        break;

      case 403:
        title = app.pageNotAllowed
        app.errorMessage = 'You are not allowed to access this page'
        break;
    
      default:
        title = app.pageOtherError
        break;
    }
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
