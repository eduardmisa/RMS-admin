<template>
  <v-layout
    row
    justify-center
    align-center
    wrap
  >
    <!-- <v-flex
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
    </v-flex> -->


    <v-flex
      v-for="(item, i) in loaders"
      :key="i"
      class="ma-3"
      width="100"
    >
      <v-card :loading="item.state">
        <v-system-bar color="primary" v-if="!item.state"></v-system-bar>
        <v-card-text class="d-flex flex-column">
          <span class="text-subtitle-2 text-center">{{item.displayName}}</span>
          <br>
          <v-btn color="primary" text @click="GotoList(item.toRoute)">{{item.count}}</v-btn>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer />
          <v-btn icon color="primary" @click="fetchCount(item.name)" :loading="item.state"><v-icon>mdi-reload</v-icon></v-btn>
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
      loaders: [
        {name: "Service", displayName: "Services", state: false, count: 0, toRoute: '/services'},
        {name: "ServiceRoute", displayName: "Service Routes", state: false, count: 0, toRoute: '/service-routes'},
        {name: "Permission", displayName: "Permissions", state: false, count: 0, toRoute: '/permissions'},
        {name: "Group", displayName: "Groups", state: false, count: 0, toRoute: '/groups'},
        {name: "User", displayName: "Users", state: false, count: 0, toRoute: '/users'},
        {name: "Client", displayName: "Clients", state: false, count: 0, toRoute: '/clients'},
      ]
    }
  },
  methods: {
    async fetchCount (name) {
      const app = this

      var item = app.loaders.find(a => a.name === name)

      item.state = !item.state

      try {

        let { data } = await app.$api[`${name}Service`].CountAll()

        item.count = data.count

      } catch { }

      item.state = !item.state
    },
    GotoList (route) {
      this.$router.push(route)
    }
  },
  mounted () {
    const app = this
    let promises = []

    app.loaders.forEach(loader => {
      promises.push(
        app.fetchCount(loader.name)
      )
    })

    Promise.all(promises)
  }
}
</script>
