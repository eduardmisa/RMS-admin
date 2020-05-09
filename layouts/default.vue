<template>
  <v-app>
    <!--  -->
    <v-app-bar
      app
      flat
      fixed
      clipped-left
      :dense="isMobile"
    >
      <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer" v-if="isMobile"/>
      <v-btn class="pr-1 pl-0 ml-0" tile text x-large color="primary" @click="$router.push('/')">
        <v-icon :class="!isMobile ? 'mr-4': ''">mdi-security</v-icon>
        <span class="title font-weight-bold text-capitalize ml-3">{{title}}</span>
      </v-btn>
      <v-spacer />
      <v-btn class="pr-1 pl-1" tile text x-large color="primary" @click="ToggleDarkMode()">
        <v-icon v-if="$vuetify.theme.dark">mdi-brightness-3</v-icon>
        <v-icon v-else>mdi-brightness-5</v-icon>
      </v-btn>
    </v-app-bar>


    <!-- app -->
    <!--  -->
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      clipped
      hide-overlay
      :mini-variant="miniVariant"
      :permanent="!isMobile"
      class="d-flex"
    >
      <div>
        <v-list dense class="pb-0 pt-0">
          <v-menu
            v-model="menu"
            offset-x
            open-on-hover
            :close-on-content-click="false"
            :nudge-width="200"
          >
            <template v-slot:activator="{ on }">
              <v-list-item link class="pt-5 pb-3" v-on="miniVariant ? on: null">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="subtitle-1 text-uppercase">{{$auth.user.firstname}} {{$auth.user.lastname}}</v-list-item-title>
                  <v-list-item-subtitle class="overline" v-if="$auth.user.is_superuser">Superuser</v-list-item-subtitle>
                  <v-list-item-subtitle class="overline" v-else v-for="item in $auth.user.group" :key="item">{{item}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title class="caption text-uppercase font-weight-bold pt-2 pb-2">Profile</v-card-title>
              <v-divider></v-divider>
              <v-container class="pt-0">
                <v-list-item-content>
                  <v-list-item-title class="title text-uppercase">{{$auth.user.firstname}} {{$auth.user.lastname}}</v-list-item-title>
                  <v-list-item-subtitle class="overline" v-if="$auth.user.is_superuser">Superuser</v-list-item-subtitle>
                  <v-list-item-subtitle class="overline" v-else v-for="item in $auth.user.group" :key="item">{{item}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-container>
            </v-card>
          </v-menu>
        </v-list>
        <v-divider></v-divider>
        <nexted
          :list="Modules"
          :miniVariant="miniVariant"
          floating
        />
      </div>

      <div class="mt-auto">
        <v-divider></v-divider>
        <v-list dense class="pb-0 pt-0">
          <v-list-item @click.stop="drawer=false" dense v-if="isMobile">
            <v-list-item-content>
              <v-icon color="accent">mdi-window-close</v-icon>
            </v-list-item-content>
          </v-list-item>
          <div v-else>
            <v-list-item @click.stop="miniVariant = !miniVariant" dense>
              <v-list-item-icon v-if="miniVariant">
                <v-icon color="accent">mdi-chevron-double-{{ `${miniVariant ? 'right' : 'left'}` }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-icon color="accent">mdi-chevron-double-{{ `${miniVariant ? 'right' : 'left'}` }}</v-icon>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
        <v-divider></v-divider>
      </div>
    </v-navigation-drawer>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>


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
      title: 'RMS Admin'
    }
  },
  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    CurrentUser () {
      return this.$auth.user
    },
    Modules () {
      const app = this

      let permissions = app.CurrentUser && app.CurrentUser.application && 'user_modules' in app.CurrentUser.application ? app.CurrentUser.application.user_modules : []

      return app.GroupRawPermissionsByModule(permissions)
    },
  },
  methods: {
    ToggleDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    GroupRawPermissionsByModule (permissions) {
      let result = []
      // List of:
      // {
      //     "code": "MOD-2",
      //     "name": "List",
      //     "icon": "",
      //     "url": "/applications",
      //     "parent": "MOD-1"
      // }
        // TODO: Investigate this:
        var array = permissions
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
  },
  mounted () {
    // this.drawer = true
  }
}
</script>
