<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <!-- :to="item.to"
      router
      exact -->
      <!-- <v-list
        v-for="item in Modules"
        :key="item.moduleCode"
        dense
      >
        <v-list-group
          :prepend-icon="item.moduleIcon"
          :ripple="false"
        >
          <template v-slot:activator>
            <v-list-item-title class="subtitle-1">{{item.moduleName}}</v-list-item-title>
          </template>

          <v-list-item
            v-for="permission in item.permissions"
            :key="permission.permission"
          >
            <v-list-item-icon>
              <v-btn
                small
                outlined
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
      </v-list> -->

      <nexted :list="Modules"/>






    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-btn class="pr-1 pl-1" tile text x-large color="accent" @click="$router.push('/')">
        <v-icon left>mdi-security</v-icon>
        <span class="title font-weight-regular text-capitalize">{{title}}</span>
      </v-btn>
      <v-spacer />

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
    <v-content style="margin-top:16px!important;">
      <nuxt />
    </v-content>
    <v-navigation-drawer
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
    </v-navigation-drawer>
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
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'RMS Admin'
    }
  },
  computed: {
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
    GroupRawPermissionsByModule (permissions, searchKey) {
      let result = []

      let rawPermissions = permissions.map(a => ({...a, ...{icon: ''}}))
      // List of:
      // {
      //   "module_parent_code": "MOD-10"
      //   "module_parent_name": "Applications"
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
          moduleParentCode: '',
          moduleParentName: '',
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

          existing.moduleParentCode = item.parent_module_code
          existing.moduleParentName = item.parent_module_name

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
      // moduleParentCode: "MOD-10"
      // moduleParentName: "Applications"
      // moduleCode: "MOD-13"
      // moduleName: "List Application"
      // moduleIcon: "mdi-stove"
      // permissions: []
      // }

      let result = []

      if (permissions.length > 0) {

        var childrenWithoutParent = permissions.filter(a =>
            a.moduleParentCode && !permissions.find(b => b.moduleCode == a.moduleParentCode)
          )

        let newParents = []
        childrenWithoutParent.forEach(item => {

          var existing = newParents.find(a => a.moduleCode == item.moduleParentCode)

          if (!existing) {
            newParents.push({
                moduleParentCode: null,
                moduleParentName: null,
                moduleCode: item.moduleParentCode,
                moduleName: item.moduleParentName,
                moduleIcon: "mdi-stove",
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


}
</script>
