<template>
  <v-row>
    <deleteComponent :applicationId="applicationId"/>
  </v-row>
</template>

<script>
import deleteComponent from "@/components/applications/delete"

export default {
  components: {
    deleteComponent
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

