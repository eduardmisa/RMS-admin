<template>
  <v-app>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12 mb-5 pa-5" color="primary">
              <v-card-text class="mt-4 text-center">
                <span class="display-3">RMS PORTAL</span>
                <v-icon class="display-3">mdi-code-braces</v-icon>
              </v-card-text>
            </v-card>

            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                flat
              >
                <v-toolbar-title><span class="title">Superuser Login</span></v-toolbar-title>
                <v-spacer />
                <v-btn color="secondary" :loading="isLoading" @click="Login">Login</v-btn>
              </v-toolbar>
              <v-card-text class="mt-4">
                <v-form>
                  <v-text-field
                    v-model="loginForm.username"
                    label="Login"
                    prepend-icon="mdi-account"
                    type="text"
                  />

                  <v-text-field
                    v-model="loginForm.password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                  />

                  <v-text-field
                    v-model="loginForm.client_id"
                    label="Client Id"
                    prepend-icon="mdi-key-variant"
                    type="text"
                  />

                  <v-text-field
                    v-model="loginForm.client_secret"
                    label="Client Secret"
                    prepend-icon="mdi-key-variant"
                    type="text"
                  />

                  <v-text-field
                    v-model="loginForm.scope"
                    label="Scope"
                    prepend-icon="mdi-web"
                    type="text"
                  />

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbarColor"
      multi-line
      :timeout="2000"
    >
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    layout: 'login',
    data () {
      return {
        isLoading: false,
        snackbar: false,
        snackbarColor: null,
        message: null,
        loginForm: {
          username: 'superuser',
          password: 'p@ssw0rd',

          client_id: 'nHIAtBPnc2BqkKstUU1Y7SaeXzX079i6',
          client_secret: 'UFDbl6o7FTMEJqMSVZBNqbCtV6ij3ymm',
          scope: 'APP-1'
        }
      }
    },
    methods: {
      async Login () {
        const app = this
        app.isLoading = true

        let response = await app.$auth.login(app.loginForm)

        if (!response.success) {
          app.showSnackbar(response.error, 'error')
          app.isLoading = false
          return
        }
        
        document.location.reload()
      },
      showSnackbar (message, color) {
        this.snackbar = true;
        this.message = message;
        this.snackbarColor = color
      }
    }

  }
</script>