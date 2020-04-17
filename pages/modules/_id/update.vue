<template>
  <v-row>
    <updateComponent :moduleId="moduleId"/>
  </v-row>
</template>

<script>
import updateComponent from "@/components/modules/update"

export default {
  components: {
    updateComponent
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

