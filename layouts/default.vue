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

      <v-list>
        <v-list-item
          v-for="item in modules.items"
          :key="item.moduleCode"
        >
          <!-- {
            "moduleCode": "MOD-2",
            "moduleName": "Clients",
            "moduleIcon": "mdi-icon",
            "permissions": [
              {
                "method": "GET",
                "url": "/api/v1/Clients/",
                "permission": "GET"
              },
              {
                "method": "POST",
                "url": "/api/v1/Clients/",
                "permission": "POST"
              },
              {
                "method": "PUT",
                "url": "/api/v1/Clients/",
                "permission": "PUT"
              },
              {
                "method": "DELETE",
                "url": "/api/v1/Clients/",
                "permission": "DELETE"
              }
            ]
          } -->
          <v-list-item-action>
            <v-icon>{{ item.moduleIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.moduleName" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
        <v-icon left dark>mdi-meteor</v-icon>
        <span class="title font-weight-regular text-capitalize">{{title}}</span>
      </v-btn>
      <v-spacer />
      <v-btn color="secondary" tile text x-large @click="$router.push('/user-finder')" v-if="!$vuetify.breakpoint.xs">
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
      </v-btn>
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
import {mapState} from 'vuex'

export default {
  computed: mapState(['modules']),

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
      title: 'RMS Portal'
    }
  }
}
</script>
