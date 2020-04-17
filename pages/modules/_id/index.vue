<template>
  <v-row>
    <viewComponent :moduleId="moduleId"/>
  </v-row>
</template>

<script>
import viewComponent from "@/components/modules/view"

export default {
  components: {
    viewComponent
  },
  data () {
    return {
      moduleId: null
    }
  },
  created () {
    this.moduleId = this.$route.params.id
  }
}
</script>

