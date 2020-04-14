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
          <v-btn outlined color="primary" @click="$toast({message:'Hello',color:'primary'})">primary</v-btn>
          <br>
          <v-btn outlined color="accent" @click="$toast({message:'Hello',color:'accent'})">accent</v-btn>
          <br>
          <v-btn outlined color="secondary" @click="$toast({message:'Hello',color:'secondary'})">secondary</v-btn>
          <br>
          <v-btn outlined color="info" @click="$toast({message:'Hello',color:'info'})">info</v-btn>
          <br>
          <v-btn outlined color="warning" @click="$toast({message:'Hello',color:'warning'})">warning</v-btn>
          <br>
          <v-btn outlined color="error" @click="$toast({message:'Hello',color:'error'})">error</v-btn>
          <br>
          <v-btn outlined color="success" @click="$toast({message:'Hello',color:'success'})">success</v-btn>
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
