<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title>
          &nbsp;
        </v-card-title>
        <v-card-text class="d-flex flex-column">
          <span class="display-4">Welcome</span>
          <br>
          <br>
          <v-btn outlined color="primary">primary</v-btn>
          <br>
          <v-btn outlined color="accent">accent</v-btn>
          <br>
          <v-btn outlined color="secondary">secondary</v-btn>
          <br>
          <v-btn outlined color="info">info</v-btn>
          <br>
          <v-btn outlined color="warning">warning</v-btn>
          <br>
          <v-btn outlined color="error">error</v-btn>
          <br>
          <v-btn outlined color="success">success</v-btn>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer />
          
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {

    }
  },
}
</script>
