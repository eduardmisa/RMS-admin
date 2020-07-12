<template>
  <v-list-group :append-icon="null" :ripple="false">
    <template v-slot:activator>
      <v-list-item-content >
        <v-list-item-title class="pt-3 pb-3 text-center text-uppercase">{{item.name}}</v-list-item-title>
      </v-list-item-content>
    </template>
    <!-- <v-divider></v-divider> -->
    <v-list rounded>
      <v-list-item-group v-model="selected">
        <v-list-item
          v-for="subModule in item.subModules"
          :key="subModule.code"
          :to="subModule.url ? subModule.url: '/'"
          exact
          class="mt-1 mb-1"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subModule.name" class="text-center"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
  </v-list-group>
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
      menu: false,
      selected: null
    }
  }

}
</script>

<style>
/* .link-active {
  border-left: 2px dashed orange;
} */
</style>