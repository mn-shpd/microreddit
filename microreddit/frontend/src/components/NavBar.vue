<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <a id="logo" class="navbar-brand" href="/">Micro<span id="red-logo-part">Red</span>dit</a>
      <div id="user-actions" class="d-flex">
          <div v-if="loggedIn">Witaj, {{username}}!</div>
          <router-link id="userpanel" to="/userpanel" v-if="loggedIn">Panel użytkownika</router-link>
          <router-link v-if="!loggedIn" id="login" to="/login" class="col">Logowanie</router-link>
          <router-link v-if="!loggedIn" id="register" to="/register" class="col">Rejestracja</router-link>
          <a v-if="loggedIn" id="logout" vtype="button" @click="logout">Wyloguj</a>
      </div>
    </div>
  </nav>
</template>

<script>
import userService from '../services/user';
import { mapState } from 'vuex';

export default {
  name: 'NavBar',
  computed: mapState([
    "loggedIn",
    "username"
  ]),
  methods: {
    async logout() {
      await userService.logout();
      this.$store.commit("resetUser");
      sessionStorage.clear();
      this.$router.push("/");
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

      #login, #register, #userpanel, #logout {
        color: white;
        margin: 0 10px;
        text-decoration: none;
      }

      #logout {
        cursor: pointer;
      }
    }
  }
</style>
