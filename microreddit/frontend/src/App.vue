<template>
  <div id="app">
    <NavBar id="navbar"/>
    <div id="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: "App",
  components: {
    NavBar
  }
};
</script>

<style scoped lang="scss">
  @font-face {
    font-family: "Secular-One";
    src: local("Secular-One"),
    url(./fonts/SecularOne-Regular.ttf) format("truetype");
  }

  #app {
    display: flex;
    flex-direction: column;
    font-family: "Secular-One", sans-serif;
    background-color: rgb(238, 238, 238);

    #content-container {
      min-height: 90vh;
    }
  }
</style>
