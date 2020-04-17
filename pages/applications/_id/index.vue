<template>
  <v-row>
    <viewComponent :applicationId="applicationId"/>
  </v-row>
</template>

<script>
import viewComponent from "@/components/applications/view"

export default {
  components: {
    viewComponent
  },
  data () {
    return {
      applicationId: null
    }
  },
  created () {
    this.applicationId = this.$route.params.id
  }
}
</script>

