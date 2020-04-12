<template>
  <v-container>
    <!-- <v-row> -->

      <v-col>
        <v-card>
          <v-card-title>
            <v-container>
              <v-row align="center">
                <span class="title">Service Lookup</span>
                <v-spacer></v-spacer>
                <v-btn small outlined color="primary" @click="SendRequest">Send</v-btn>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="token"
                label="Token"
                outlined
                dense
              ></v-text-field>
              <v-select
                v-model="method"
                :items="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
                label="Method"
                outlined
                dense
              ></v-select>
              <v-text-field
                v-model="url"
                label="Url"
                outlined
              ></v-text-field>
              <v-textarea
                v-model="body"
                outlined
                label="Body"
                dense
              ></v-textarea>
            </v-container>

          </v-card-text>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>
            <v-container>
              <v-row align="center">
                <span class="title">Response</span>
                <v-spacer></v-spacer>
                <v-btn small outlined :color="responseSuccess? 'success' : 'error'" v-if="responseCode">{{responseCode}}</v-btn>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <br>
            <pre>{{responseData}}</pre>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>

    <!-- </v-row> -->
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  components: {
  },
  data () {
    return {
      token: null,
      method: null,
      url: null,
      body: null,
      response: null
    }
  },
  computed: {
    responseCode () {
      try {
        return this.response.status
      } catch (error) {
        
      }
    },
    responseSuccess () {
      try {
        return this.responseCode >= 200 && this.responseCode < 300
      } catch (error) {
        
      }
    },
    responseData () {
      try {
        return this.response.data
      } catch (error) {
        
      }
    },
  },
  methods: {
    async SendRequest () {
      const app = this

      const httpClient = app.$axios

      switch (app.method) {
        case "GET":
          httpClient.get(app.url, { headers: { Authorization: `Bearer ${app.token}`}})
          .then(data => {
            app.response = data
          })
          .catch(error => { 
            app.response = error.response
          })
          break;
          
        case "POST":
          httpClient.post(app.url, app.getBody(), { headers: { Authorization: `Bearer ${app.token}`}})
          .then(data => {
            app.response = data
          })
          .catch(error => { 
            app.response = error.response
          })
          break;

        case "PUT":
          httpClient.put(app.url, app.getBody(), { headers: { Authorization: `Bearer ${app.token}`}})
          .then(data => {
            app.response = data
          })
          .catch(error => { 
            app.response = error.response
          })
          break;

        case "PATCH":
          httpClient.patch(app.url, app.getBody(), { headers: { Authorization: `Bearer ${app.token}`}})
          .then(data => {
            app.response = data
          })
          .catch(error => { 
            app.response = error.response
          })
          break;

        case "DELETE":
          httpClient.delete(app.url, { headers: { Authorization: `Bearer ${app.token}`}})
          .then(data => {
            app.response = data
          })
          .catch(error => { 
            app.response = error.response
          })
          break;

        default:
          alert('Invalid Method')
          break;
      }

    },
    getBody () {
      const app = this
      try {
        return JSON.parse(app.body)
      } catch (error) {
        alert('Invalid Json Format')
      }
    }
  },
  created () {
    this.token = this.$route.query.token
    this.method = this.$route.query.method
    this.url = this.$route.query.url
  }
}
</script>
