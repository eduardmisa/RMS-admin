<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :fixed="true"

      :permanent="false"
    >
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
                <v-list-item-title class="title">{{$auth.user.firstname}} {{$auth.user.lastname}}</v-list-item-title>
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
                <v-list-item-title class="title">{{$auth.user.firstname}} {{$auth.user.lastname}}</v-list-item-title>
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
      />
      <v-divider></v-divider>
      <v-list dense class="pb-0 pt-0">
        <v-list-item @click.stop="miniVariant = !miniVariant" dense>
          <v-list-item-icon class="mr-0" v-if="miniVariant">
            <v-icon>mdi-chevron-double-{{ `${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-icon>mdi-chevron-double-{{ `${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-app-bar
      app
      :clipped-left="clipped"
      fixed
      :dense="IsSmallerDevices"
      flat
    >
      <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer" v-if="IsSmallerDevices"/>
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-btn class="pr-1 pl-1" tile text x-large color="primary" @click="$router.push('/')">
        <v-icon>mdi-security</v-icon>
        <span class="title font-weight-regular text-capitalize ml-3">{{title}}</span>
      </v-btn>
      <v-spacer />

      
      <v-btn class="pr-1 pl-1" tile text x-large color="primary" @click="ToggleDarkMode()">
        <!-- <span class="caption font-weight-regular text-capitalize mr-2">Darkmode</span> -->
        <v-icon v-if="$vuetify.theme.dark">mdi-brightness-3</v-icon>
        <v-icon v-else>mdi-brightness-5</v-icon>
      </v-btn>

      <!-- <v-btn color="secondary" tile text x-large @click="$router.push('/user-finder')" v-if="!$vuetify.breakpoint.xs">
        <span class="caption">User finder</span>
        <v-icon right dark>mdi-account-search</v-icon>
      </v-btn>
      <v-btn color="secondary" tile text x-large @click="$router.push('/service-finder')" v-if="!$vuetify.breakpoint.xs">
        <span class="caption">Service finder</span>
        <v-icon right dark>mdi-search-web</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
        v-if="$vuetify.breakpoint.xs"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-content app style="margin-top:16px!important;">
      <nuxt />
    </v-content>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item link to="/user-finder">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-account-search
            </v-icon>
          </v-list-item-action>
          <v-list-item-title><span class="primary--text">User finder</span></v-list-item-title>
        </v-list-item>

        <v-list-item link to="/service-finder">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-search-web
            </v-icon>
          </v-list-item-action>
          <v-list-item-title><span class="primary--text">Service finder</span></v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
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
    IsSmallerDevices () {
      return this.$vuetify.breakpoint.xs
          || this.$vuetify.breakpoint.sm
          || this.$vuetify.breakpoint.md
    },
    CurrentUser () {
      return this.$auth.user
    },
    Modules () {
      const app = this

      let searchKey = ''

      let permissions = app.CurrentUser && app.CurrentUser.application && 'permissions' in app.CurrentUser.application ? app.CurrentUser.application.permissions : []

      return app.GroupRawPermissionsByModule(permissions, searchKey)
    },
  },
  methods: {
    ToggleDarkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    GroupRawPermissionsByModule (permissions, searchKey) {
      let result = []

      let rawPermissions = permissions
      // List of:
      // {
      //   "module_parent_code": "MOD-10"
      //   "module_parent_name": "Applications"
      //   "parent_module_front_icon": "MOD-10"
      //   "parent_module_front_url": "MOD-10"
      //   "module_code": "MOD-2",
      //   "module_name": "Clients",
      //   "module_front_icon": "MOD-2",
      //   "module_front_url": "MOD-2",
      //   "permission": "Can List Clients",
      //   "method": "GET",
      //   "url": "/api/v1/Clients/"
      // }

      // Group by module
      let uniqueCodes = new Set(rawPermissions.map(raw => raw.module_code))

      uniqueCodes.forEach(moduleCode => {
        result.push({
          moduleParentCode: '',
          moduleParentName: '',
          moduleParentIcon: '',
          moduleParentUrl: '',

          moduleCode: moduleCode,
          moduleName: '',
          moduleIcon: '',
          moduleUrl: ',',
          permissions: []
        })
      })

      rawPermissions.forEach(item => {

        let existing = result.find(a => a.moduleCode == item.module_code)
        if (existing) {
          existing.moduleParentCode = item.parent_module_code
          existing.moduleParentName = item.parent_module_name
          existing.moduleParentIcon = item.parent_module_front_icon ? item.parent_module_front_icon : 'mdi-alert-circle-outline'
          existing.moduleParentUrl = item.parent_module_front_url ? item.parent_module_front_url : '/'

          existing.moduleName = item.module_name
          existing.moduleIcon = item.module_front_icon ? item.module_front_icon : 'mdi-alert-circle-outline'
          existing.moduleUrl = item.module_front_url ? item.module_front_url : '/'

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

      return this.GroupModuleByParent(result.filter(a => a.permissions.length > 0))
    },
    GroupModuleByParent (permissions) {
      // LIST OF:
      // {
      // moduleParentCode: '',
      // moduleParentName: '',
      // moduleParentIcon: '',
      // moduleParentUrl: '',
      // moduleCode,
      // moduleName: '',
      // moduleIcon: '',
      // moduleUrl: ',',
      // permissions: []
      // }

      let result = []

      if (permissions.length > 0) {

        // Find modules that has parent
        // but parent not in the list
        // -> will create their parent manually
        let newParents = []

        var childrenWithoutParent = permissions.filter(a =>
            a.moduleParentCode && !permissions.find(b => b.moduleCode == a.moduleParentCode)
          )
        childrenWithoutParent.forEach(item => {

          var existing = newParents.find(a => a.moduleCode == item.moduleParentCode)

          if (!existing) {
            newParents.push({
                moduleParentCode: null,
                moduleParentName: null,
                moduleParentIcon: null,
                moduleParentUrl: null,
                moduleCode: item.moduleParentCode,
                moduleName: item.moduleParentName,
                moduleIcon: item.moduleParentIcon,
                moduleUrl: item.moduleParentUrl,
                permissions: []
              })
          }
        })

        let allPermissions = permissions.concat(newParents)

        // TODO: Investigate this:
        var array = allPermissions
        for (var i = 0; i < array.length; i++) {
          var parent = array[i].moduleParentCode;
          if (!parent) {
            result.push(array[i]);
          } else {
            // You'll want to replace this with a more efficient search
            for (var j = 0; j < array.length; j++) {
              if (array[j].moduleCode === parent) {
                array[j].subModules = array[j].subModules || [];
                array[j].subModules.push(array[i]);
                break;
              }
            }
          }
        }

      }

      console.log(result)

      return result
    }
  },
  mounted () {
    this.drawer = true
  }
}
</script>
