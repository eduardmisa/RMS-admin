<template>
  <v-row>
    <deleteComponent :moduleId="moduleId"/>
  </v-row>
</template>

<script>
import deleteComponent from "@/components/modules/delete"

export default {
  components: {
    deleteComponent
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

