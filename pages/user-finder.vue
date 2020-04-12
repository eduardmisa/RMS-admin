<template>
  <v-container>
    <v-row>

      <v-col>
        <v-card>
          <v-card-title>
            <v-container>
              <v-row align="center">
                <span class="title">OAuth2 Login</span>
                <v-spacer></v-spacer>
                <v-btn small outlined color="primary" @click="Login">View Details</v-btn>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field
                  v-model="loginForm.username"
                  label="Username"
                  outlined
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="loginForm.password"
                  type="password"
                  label="Password"
                  outlined
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="loginForm.client_id"
                  label="Client Id"
                  outlined
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="loginForm.client_secret"
                  label="Client Secret"
                  outlined
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="loginForm.scope"
                  label="Scope"
                  outlined
                ></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="ShowDetails">
        <v-card>
          <v-card-title>
            <v-container>
              <v-row align="center">
                <span class="title">User details</span>
                <v-spacer></v-spacer>
                <div>
                  <v-btn small outlined color="error" @click="Clear">Clear Details</v-btn>
                  <v-btn small outlined color="success" @click="LoadModules">Load Modules</v-btn>
                </div>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <span>Access Token: </span><strong>{{accessToken}}</strong>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn icon color="secondary" small v-on="on" @click="CopyToken"><v-icon small>mdi-content-copy</v-icon></v-btn>
              </template>
              <span class="overline">Copy Token</span>
            </v-tooltip>
            <v-switch
              v-model="showSimplifiedUserDetails"
              :label="`Raw`"
              color="primary"
              hide-details
              dense
            ></v-switch>
            <v-row v-if="!showSimplifiedUserDetails">
              <v-col cols-2>
                <v-checkbox
                  :value="currentUser ? currentUser.is_superuser: false"
                  :label="`Superuser`"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-checkbox>
                <v-text-field
                  :value="currentUser ? currentUser.username: ''"
                  label="Username"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser ? currentUser.email: ''"
                  label="Email"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser ? currentUser.firstname: ''"
                  label="Firstname"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser ? currentUser.middlename: ''"
                  label="Middlename"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser ? currentUser.lastname: ''"
                  label="Lastname"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser ? currentUser.birthdate: ''"
                  label="Birthdate"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-combobox
                  :value="currentUser ? currentUser.group: []"
                  label="Groups"
                  multiple
                  chips
                  hide-details
                  disabled
                  class="mb-5"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      @click:close="data.parent.selectItem(data.item)"
                    >
                      <v-avatar
                        class="success grey--text"
                        left
                        v-text="data.item.slice(0, 1).toUpperCase()"
                      ></v-avatar>
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols-10>
                <v-checkbox
                  :value="currentUser && currentUser.application ? currentUser.application.is_administrator: false"
                  :label="`Administrator`"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-checkbox>
                <v-text-field
                  :value="currentUser && currentUser.application ? currentUser.application.name: ''"
                  label="Application"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  :value="currentUser && currentUser.application ? currentUser.application.description: ''"
                  label="Application description"
                  hide-details
                  disabled
                  class="mb-5"
                ></v-text-field>
                <v-switch
                  v-model="showRawPermissionList"
                  label="Show Permission list"
                  color="primary"
                  hide-details
                  dense
                ></v-switch>
                <v-card flat class="mt-3" v-if="showRawPermissionList">
                  <v-simple-table fixed-header height="400px" dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="text-left">moduleCode</th> -->
                          <th class="text-left">Module</th>
                          <th class="text-left">Permission</th>
                          <!-- <th class="text-left">method</th> -->
                          <!-- <th class="text-left">url</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in currentUser && currentUser.application ? currentUser.application.permissions: []" :key="item.name">
                          <!-- <td>{{ item.module_code }}</td> -->
                          <td>{{ item.module_name }}</td>
                          <td>{{ item.permission }}</td>
                          <!-- <td>{{ item.method }}</td> -->
                          <!-- <td>{{ item.url }}</td> -->
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>

              </v-col>
            </v-row>
            <pre v-else>{{this.currentUser}}</pre>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer />
            
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col v-if="ShowDetails">
        <v-tabs
          v-model="tab"
          grow
          :icons-and-text="$vuetify.breakpoint.width > 350"
        >
          <!-- <v-tabs-slider></v-tabs-slider> -->
          <v-tab href="#tab-1">
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">Access</span>
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">User</span>
            <v-icon class="mb-1 mt-2">mdi-account-check</v-icon>
          </v-tab>
          <v-tab href="#tab-2">
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">Access</span>
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">User External</span>
            <v-icon class="mb-1 mt-2">mdi-account-network</v-icon>
          </v-tab>
          <v-tab href="#tab-3">
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">Access</span>
            <span class="overline" v-if="$vuetify.breakpoint.width > 350">Client</span>
            <v-icon class="mb-1 mt-2">mdi-cloud-check</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            :value="'tab-1'"
          >
            <v-card>
              <v-card-title>
                <v-container>
                  <v-row align="center">
                    <!-- <span class="title mr-3">User {{UserApplicationAccess}} Access</span> -->
                    <v-text-field
                      v-model="permission_search"
                      label="Search"
                      outlined
                      dense
                      hide-details
                    >
                      <template v-slot:append><v-icon>mdi-magnify</v-icon></template>
                    </v-text-field>
                  </v-row>
                </v-container>
              </v-card-title>
              <v-card-text>
                <v-list
                  v-for="item in Permissions"
                  :key="item.moduleCode"
                  dense
                >
                  <v-list-group
                    :prepend-icon="item.moduleIcon"
                    value="true"
                    disabled
                    :ripple="false"
                  >
                    <template v-slot:activator>
                      <v-list-item-title class="ml-5 pl-5 subtitle-1">{{item.moduleName}}</v-list-item-title>
                    </template>

                    <v-list-item
                      v-for="permission in item.permissions"
                      :key="permission.permission"
                    >
                      <v-list-item-icon>
                        <v-btn
                          small
                          outlined
                          :color="DetermineApiButtonColor(permission.method)"
                          :width="65"
                          @click="FindService(permission)"
                          >
                          {{permission.method}}</v-btn>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.url"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.permission"></v-list-item-title>
                      </v-list-item-content>

                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer />
                
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item
            :value="'tab-2'"
          >
            <v-card>
              <v-card-title>
                <v-container>
                  <v-row align="center">
                    <!-- <span class="title mr-3">User External Access</span> -->
                    <v-text-field
                      v-model="external_permission_search"
                      label="Search"
                      outlined
                      dense
                      hide-details
                    >
                      <template v-slot:append><v-icon>mdi-magnify</v-icon></template>
                    </v-text-field>
                  </v-row>
                </v-container>
              </v-card-title>
              <v-card-text>
                <v-list
                  v-for="item in ExternalPermissions"
                  :key="item.moduleCode"
                  dense
                >
                  <v-list-group
                    :prepend-icon="item.moduleIcon"
                    value="true"
                    disabled
                    :ripple="false"
                  >
                    <template v-slot:activator>
                      <v-list-item-title class="ml-5 pl-5 subtitle-1">{{item.moduleName}}</v-list-item-title>
                    </template>

                    <v-list-item
                      v-for="permission in item.permissions"
                      :key="permission.permission"
                    >
                      <v-list-item-icon>
                        <v-btn
                          small
                          outlined
                          :color="DetermineApiButtonColor(permission.method)"
                          :width="65"
                          @click="FindService(permission)"
                          >
                          {{permission.method}}</v-btn>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.url"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.permission"></v-list-item-title>
                      </v-list-item-content>

                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer />
                
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item
            :value="'tab-3'"
          >
            <v-card>
              <v-card-title>
                <v-container>
                  <v-row align="center">
                    <!-- <span class="title mr-3">Client Access</span> -->
                    <v-text-field
                      v-model="client_permission_search"
                      label="Search"
                      outlined
                      dense
                      hide-details
                    >
                      <template v-slot:append><v-icon>mdi-magnify</v-icon></template>
                    </v-text-field>
                  </v-row>
                </v-container>
              </v-card-title>
              <v-card-text>
                <v-list
                  v-for="item in ClientOverallPermissions"
                  :key="item.moduleCode"
                  dense
                >
                  <v-list-group
                    :prepend-icon="item.moduleIcon"
                    value="true"
                    disabled
                    :ripple="false"
                  >
                    <template v-slot:activator>
                      <v-list-item-title class="ml-5 pl-5 subtitle-1">{{item.moduleName}}</v-list-item-title>
                    </template>

                    <v-list-item
                      v-for="permission in item.permissions"
                      :key="permission.permission"
                    >
                      <v-list-item-icon>
                        <v-btn
                          small
                          outlined
                          :color="DetermineApiButtonColor(permission.method)"
                          :width="65"
                          @click="FindService(permission)"
                          >
                          {{permission.method}}</v-btn>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.url"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title v-text="permission.permission"></v-list-item-title>
                      </v-list-item-content>

                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer />
                
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username : "",
        password : "",
        client_id : "nHIAtBPnc2BqkKstUU1Y7SaeXzX079i6",
        client_secret : "UFDbl6o7FTMEJqMSVZBNqbCtV6ij3ymm",
        scope : "APP-1"
      },
      tab: null,
      showSimplifiedUserDetails: false,
      showRawPermissionList: false,
      currentUser: null,
      accessToken: null,
      permission_search: null,
      external_permission_search: null,
      client_permission_search: null,
      clientOverAllAccess: []
    }
  },
  computed: {
    ShowDetails () {
      return this.accessToken != null
    },
    UserApplicationAccess () {
      return this.currentUser && this.currentUser.application ? this.currentUser.application.name : ''
    },
    Permissions () {
      const app = this

      let searchKey = app.permission_search

      let permissions = app.currentUser && app.currentUser.application && 'permissions' in app.currentUser.application ? app.currentUser.application.permissions : []

      return app.GroupRawPermissionsByModule(permissions, searchKey)
    },
    ExternalPermissions () {
      const app = this

      let searchKey = app.external_permission_search

      let permissions = app.currentUser &&  app.currentUser.application && 'external_permissions' in app.currentUser.application ? app.currentUser.application.external_permissions : []

      return app.GroupRawPermissionsByModule(permissions, searchKey)
    },
    ClientOverallPermissions () {
      const app = this

      let searchKey = app.client_permission_search

      let permissions = app.clientOverAllAccess

      return app.GroupRawPermissionsByModule(permissions, searchKey)
    }
  },
  methods: {
    Clear () {
      this.loginForm = {
        username : "",
        password : "",
        client_id : this.loginForm.client_id,
        client_secret : this.loginForm.client_secret,
        scope : this.loginForm.scope
      }
      this.currentUser = {}
      this.accessToken = null
    },
    async Login () {
      const app = this

      let response = await app.$api.AuthService.Login(app.loginForm)
      if (response.success) {
        app.accessToken = response.data.access_token

        response = await app.$api.AuthService.CurrentUser(app.accessToken)
        if (response.success) {
          app.currentUser = response.data
          app.GetClientOverallAccess(app.currentUser.application.client_id)
        }
      }
      else {
        alert(response.error)
        app.currentUser = {}
        app.accessToken = null
      }
    },
    LoadModules () {
      this.$store.commit('modules/populateModules', {modules: this.Permissions})
    },
    CopyToken () {
      this.$copyText(this.accessToken);
    },
    GroupRawPermissionsByModule (permissions, searchKey) {
      let result = []

      let rawPermissions = permissions.map(a => ({...a, ...{icon: ''}}))
      // List of:
      // {
      //   "module_code": "MOD-2",
      //   "module": "Clients",
      //   "permission": "Can List Clients",
      //   "method": "GET",
      //   "url": "/api/v1/Clients/"
      //   "icon": "mdi-icon"
      // }

      // Group by module
      let uniqueCodes = new Set(rawPermissions.map(raw => raw.module_code))

      uniqueCodes.forEach(moduleCode => {
        result.push({
          moduleCode,
          moduleName: '',
          moduleIcon: 'mdi-stove',
          permissions: []
        })
      })

      rawPermissions.forEach(item => {

        let existing = result.find(a => a.moduleCode == item.module_code)
        if (existing) {
          existing.moduleName = item.module_name

          if (searchKey && (!(item.permission.toLowerCase().includes(searchKey.toLowerCase())) && !(item.url.toLowerCase().includes(searchKey.toLowerCase()))) ) {
            return
          }
          existing.permissions.push({
            method: item.method,
            url: item.url,
            permission: item.permission,
          })
        }
      })

      return result.filter(a => a.permissions.length > 0)
    },
    DetermineApiButtonColor (method) {
      switch (method) {
        case 'GET':
          return 'info'
          break;
        case 'POST':
          return 'success'
          break;
        case 'PUT':
          return 'warning'
          break;
        case 'DELETE':
          return 'error'
          break;
      
        default:
          return 'secondary'
          break;
      }

    },
    FindService({ method, url, permission }) {
      this.$router.push(`/service-finder?method=${method}&url=${url}&token=${this.accessToken}`)
    },
    async GetClientOverallAccess (clientId) {
      const app = this
      let response = await app.$api.ClientService.OverAllAccess(clientId)
      if (response.success) {
        app.clientOverAllAccess = []
        response.data.results.forEach(item => {
          app.clientOverAllAccess.push(item)
        })
      }
      else {
        alert(response.error)
      }
    }
  }
}
</script>
