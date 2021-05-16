<template>
  <div id="app">
    <NavBar id="navbar"/>
    <router-view id="routerview"/>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style scoped lang="scss">
  #app {
    
    #navbar {
      min-height: 10vh;
    }

    #routerview {
      min-height: 90vh;
    }
  }
</style>
