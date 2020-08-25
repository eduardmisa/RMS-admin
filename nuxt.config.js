const colors = require('vuetify/es5/util/colors').default
require('dotenv').config()

module.exports = {
  mode: 'spa',
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'transparent' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/ApiService',
    '@/plugins/Auth',
    '@/plugins/Helper',
    '@/plugins/Toast',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    
    'nuxt-clipboard2'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_HOST,
  },
  // // CLIENT SIDE axios configuration
  // publicRuntimeConfig: {
  //   axios: {
  //     baseURL: process.env.API_HOST,
  //   }
  // },
  // // SERVER SIDE axios configuration
  // privateRuntimeConfig: {
  //   axios: {
  //     baseURL: process.env.API_HOST,
  //   }
  // },
  router: {
    middleware: ['authenticated']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Google Sans'
      }
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.brown.lighten3,
          accent: colors.brown.lighten3,
          secondary: colors.brown.lighten4,
          info: colors.blueGrey.lighten2,
          warning: colors.amber.lighten3,
          error: colors.red.lighten2,
          success: colors.lightGreen.lighten3
        },
        // light: {
        //   primary: colors.brown.lighten4,
        //   accent: colors.brown.lighten4,
        //   secondary: colors.brown.lighten3,
        //   info: colors.blueGrey.lighten2,
        //   warning: colors.amber.lighten3,
        //   error: colors.red.lighten2,
        //   success: colors.lightGreen.lighten3,
        //   base: colors.lightGreen.lighten3
        // }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  telemetry: false,
  components: true
}
