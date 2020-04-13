<template>
  <div>
    <v-menu
      v-model="menu"
      offset-x
      open-on-hover
      :close-on-content-click="true"
      :nudge-width="200"
    >
      <template v-slot:activator="{ on }">
        <v-list-group
          v-on="miniVariant ? on : null"
          link
          active-class="link-active"
        >
          <template v-slot:prependIcon>
            <v-tooltip top v-if="item.moduleIcon==='mdi-alert-circle-outline'">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{item.moduleIcon}}</v-icon>
              </template>
              <span>Icon not set</span>
            </v-tooltip>
            <v-icon v-else>{{item.moduleIcon}}</v-icon>
          </template>

          <template v-slot:activator>
            <v-list-item-title class="caption text-uppercase font-weight-bold">{{item.moduleName}}</v-list-item-title>
          </template>

          <template v-slot:appendIcon>
            <v-icon>mdi-menu-down</v-icon>
          </template>

          <div v-if="!miniVariant">
            <v-divider></v-divider>
            <v-list-item
              v-for="subModule in item.subModules"
              :key="subModule.moduleCode"
              nuxt
              :to="subModule.moduleUrl ? subModule.moduleUrl: '/'"
            >
              <v-list-item-icon><v-icon>mdi-drag-vertical</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="subModule.moduleName" class="caption font-weight-medium"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list-group>
      </template>

      <template>
        <v-card tile>
          <v-card-title class="caption text-uppercase font-weight-bold pt-2 pb-2 primary--text">  {{item.moduleName}}</v-card-title>
          <v-divider></v-divider>
          <v-list-item
            v-for="subModule in item.subModules"
            :key="subModule.moduleCode"
            nuxt
            :to="subModule.moduleUrl ? subModule.moduleUrl: '/'"
          >
            <v-list-item-icon><v-icon>mdi-drag-vertical</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="subModule.moduleName" class="caption font-weight-medium"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </template>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "nexted-item",
  props: {
    item: {
      required: true,
      type: Object
    },
    miniVariant: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      menu: false
    }
  }

}
</script>

<style>
.link-active {
  /* border-left: 2px dashed orange; */
}
</style>