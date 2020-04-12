<template>
    <v-flex>
      <v-list
        v-for="item in list"
        :key="item.moduleCode"
        dense
      >
        <!-- <nested-bitch :list="item.subModules" /> -->
        <v-list-group
          :prepend-icon="item.moduleIcon"
          :ripple="false"
        >
          <template v-slot:activator>
            <v-list-item-title>{{item.moduleName}}</v-list-item-title>
          </template>

          <v-list-item
            v-for="subModule in item.subModules"
            :key="subModule.moduleCode"
            link
          >
            <v-list-item-icon><v-icon></v-icon></v-list-item-icon>
            <v-list-item-content>
              <!-- <nested-bitch
                v-if="subModule.subModules && subModule.subModules.length > 0" 
                :list="subModule.subModules"
              /> -->
              <!-- <pre v-if="subModule.subModules && subModule.subModules.length > 0">{{subModule.subModules}}</pre> -->

              <v-list-item-title v-text="subModule.moduleName"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list-group>
      </v-list>
    </v-flex>
</template>

<script>
export default {
  name: "nested-bitch",
  props: {
    list: {
      required: false,
      type: Array
    }
  },

}
</script>

<style>

</style>