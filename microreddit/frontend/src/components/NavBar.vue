<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <a id="logo" class="navbar-brand" href="/">Micro<span id="red-logo-part">Red</span>dit</a>
      <div id="user-actions" class="d-flex">
          <router-link id="userpanel" to="/userpanel" v-if="isLoggedIn">Panel użytkownika</router-link>
          <router-link id="login" to="/login" class="col">Logowanie</router-link>
          <router-link id="register" to="/register" class="col">Rejestracja</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      isLoggedIn: true
    }
  }
}
</script>

<style scoped lang="scss">

  nav {
    background-color: dimgray;

    #logo {
      color: white;
      font-size: 25px;

      #red-logo-part {
        color: red;
      }
    }


    #user-actions {
      #login, #register, #userpanel {
        color: white;
        margin: 0 10px;
        text-decoration: none;
      }
    }
  }
</style>
