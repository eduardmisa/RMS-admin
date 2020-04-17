<template>
  <v-row>
    <updateComponent :applicationId="applicationId"/>
  </v-row>
</template>

<script>
import updateComponent from "@/components/applications/update"

export default {
  components: {
    updateComponent
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

