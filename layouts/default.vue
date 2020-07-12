<template>
  <v-app>
    <v-app-bar
      app
      flat
      fixed
      :clipped-left="clipped"
    >
      <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer"/>
      <v-btn class="pr-1 pl-0 ml-0" tile text x-large color="primary" @click="$router.push('/')">
        <span class="title font-weight-bold text-capitalize ml-3">{{title}}</span>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- {{$vuetify.breakpoint.name}}
      <v-spacer></v-spacer> -->
      <v-btn class="pr-1 pl-1" tile text x-large color="primary" @click="ToggleDarkMode">
        <v-icon v-if="$vuetify.theme.dark">mdi-brightness-3</v-icon>
        <v-icon v-else>mdi-brightness-5</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      :clipped="clipped"
      :hide-overlay="false"
      :mini-variant="miniVariant"
      class="d-flex pa-5"
    >
      <div>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1 text-center text-uppercase font-weight-medium">{{CurrentUser.firstname}} {{CurrentUser.lastname}}</v-list-item-title>
            <v-list-item-subtitle class="caption text-center font-weight-bold" v-if="CurrentUser.is_superuser">Superuser</v-list-item-subtitle>
            <v-list-item-subtitle class="caption text-center" v-else v-for="item in CurrentUser.group" :key="item">{{item}}</v-list-item-subtitle>
            <v-list-item-subtitle class="caption text-center">
              <template>
                <v-dialog v-model="logoutModal" width="250">
                  <template v-slot:activator="{ on, attrs }">
                    <a class="text-decoration-none" v-bind="attrs" v-on="on">Logout</a>
                  </template>
                  <v-card>
                    <v-card-title class="headline">
                      Logout Session
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn color="primary" text @click="logoutModal = false">
                        No
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="error" text @click="Logout">
                        Yes
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <nexted
          :list="Modules"
          :miniVariant="miniVariant"
          floating
        />
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-snackbar
      v-model="$store.state.toast.show"
      top
      :color="$store.state.toast.color"
      multi-line
      :timeout="2000"
    >
      {{ $store.state.toast.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import nexted from '@/components/nexted'
import {mapState} from 'vuex'

export default {
  components: {
    nexted
  },
  data () {
    return {
      drawer: true,
      menu: false,
      clipped: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Resource Admin',
      logoutModal: false,
      SIDE_BAR_ROUTES : [
        {code: "SBR-1", parent: null, name: "Service", url: "/services"},
        {code: "SBR-1.1", parent: "SBR-1", name: "Service List", url: "/services"},
        {code: "SBR-1.2", parent: "SBR-1", name: "Service Create", url: "/services/create"},

        {code: "SBR-2", parent: null, name: "Service Route", url: "/service-routes"},
        {code: "SBR-2.1", parent: "SBR-2", name: "Service Route List", url: "/service-routes"},
        {code: "SBR-2.2", parent: "SBR-2", name: "Service Route Create", url: "/service-routes/create"},

        {code: "SBR-3", parent: null, name: "Permission", url: "/permissions"},
        {code: "SBR-3.1", parent: "SBR-3", name: "Permission List", url: "/permissions"},
        {code: "SBR-3.2", parent: "SBR-3", name: "Permission Create", url: "/permissions/create"},

        {code: "SBR-4", parent: null, name: "Group", url: "/groups"},
        {code: "SBR-4.1", parent: "SBR-4", name: "Group List", url: "/groups"},
        {code: "SBR-4.2", parent: "SBR-4", name: "Group Create", url: "/groups/create"},

        {code: "SBR-5", parent: null, name: "Client", url: "/clients"},
        {code: "SBR-5.1", parent: "SBR-5", name: "Client List", url: "/clients"},
        {code: "SBR-5.2", parent: "SBR-5", name: "Client Create", url: "/clients/create"},

        {code: "SBR-6", parent: null, name: "User", url: "/users"},
        {code: "SBR-6.1", parent: "SBR-6", name: "User List", url: "/users"},
        {code: "SBR-6.2", parent: "SBR-6", name: "User Create", url: "/users/create"},
      ]
    }
  },
  computed: {
    CurrentUser () {
      return this.$auth.user
    },
    CurrentUserScope () {
      return this.$auth.scope
    },
    Modules () {
      const app = this
      let appRoutes = app.SIDE_BAR_ROUTES
      let userRoutes = app.GetUserPermissionRoutes()
      let accessRoutes = appRoutes.filter(a => userRoutes.includes(a.url))
      return app.GroupModulesByParent(accessRoutes)
    }
  },
  methods: {
    GetAllApplicationRoutes () {
      const app = this
      let appModules = []
      app.$router.options.routes.forEach(route => {
          appModules.push({
              code: app.$helpers.guid.generateGUID(),
              name: route.name,
              url: route.path
          })
      })
      appModules = appModules.sort((a, b) => {
                      var nameA = a.name.toUpperCase()
                      var nameB = b.name.toUpperCase()
                      if (nameA < nameB) return -1;
                      if (nameA > nameB) return 1;
                      return 0;
                    })
      return appModules
    },
    GetUserPermissionRoutes () {
      const app = this
      return app.$auth.scope.service_routes.filter(a => a.method == "ROUTE").map(a => a.url)
    },
    GroupModulesByParent (modules) {
      let result = []
        var array = modules
        for (var i = 0; i < array.length; i++) {
          var parent = array[i].parent;
          if (!parent) {
            result.push(array[i]);
          } else {
            // You'll want to replace this with a more efficient search
            for (var j = 0; j < array.length; j++) {
              if (array[j].code === parent) {
                array[j].subModules = array[j].subModules || [];
                array[j].subModules.push(array[i]);
                break;
              }
            }
          }
        }

      return result
    },
    ToggleDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      document.cookie = `dark=${this.$vuetify.theme.dark ? "1" : "0"}`
    },
    Logout () {
      this.logoutModal = false
      this.$auth.logout()
      location.reload();
    },    
  },
  mounted () {
    const app = this
    setTimeout(() => {
      let cookieObject = Object.fromEntries(document.cookie.split(/; */).map(c => {
          const [ key, ...v ] = c.split('=');
          return [ key, decodeURIComponent(v.join('=')) ];
      }));
      app.$vuetify.theme.dark = cookieObject.dark == "1" ? true : false
    },1)
  }
}
</script>

<style>
    .page-enter-active {
      animation: acrossIn .30s ease-out both;
    } 
    .page-leave-active {
      animation: acrossOut .25s ease-in both;
    } 
    @keyframes acrossIn {
      0% {
        opacity: 0;
        transform: translate3d(-10%, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes acrossOut {
      0% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      100% {
        opacity: 0;
        transform: translate3d(10%, 0, 0);
      }
    }
</style>
