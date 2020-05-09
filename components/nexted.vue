<template>
  <div>
    <v-list class="pt-0 pb-0 ">
      <NextedItem
        v-for="item in list"
        :key="item.code"
        :item="item"
        :miniVariant="miniVariant"
      />
    </v-list>
  </div>
</template>

<script>
import NextedItem from '@/components/nexted-item'

export default {
  name: "nexted",
  props: {
    list: {
      required: true,
      type: Array
    },
    miniVariant: {
      required: true,
      type: Boolean
    }
  },
  components: {
    NextedItem
  },
}
</script>

<style>

</style>