<template>
  <nav class="navbar">
    <div class="container">
      <a id="logo" class="navbar-brand" href="/">Micro<span id="red-logo-part">Red</span>dit</a>
      <div id="search-bar" class="input-group mb-3">
          <input id="search-input" type="text" class="form-control" v-model="searchString">
          <button id="search-input-button" class="btn" type="button" @click="search">Szukaj</button>
      </div>
      <div id="user-actions" class="d-flex">
          <div v-if="loggedIn">Witaj, {{username}}!</div>
          <router-link id="userpanel" to="/usersettings" v-if="loggedIn">Profil</router-link>
          <router-link v-if="!loggedIn" id="login" to="/login" class="col">Logowanie</router-link>
          <router-link v-if="!loggedIn" id="register" to="/register" class="col">Rejestracja</router-link>
          <a v-if="loggedIn" id="logout" vtype="button" @click="logout">Wyloguj</a>
      </div>
    </div>
  </nav>
</template>

<script>
import userService from "../services/user";
import { mapState } from "vuex";

export default {
  name: "NavBar",
  data () {
      return {
        searchString: ""
      };
  },
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
    },
    search() {
      if(this.searchString.length !== 0) {
        this.$router.push({ path: "/searchresults", query: { searchString: this.searchString } });
        this.searchString = "";
      }
    }
  }
};
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

    #search-bar {
      width: 300px;
      display: flex;

      #search-input-button {
          display: flex;
          align-items: center;
          background-color: bisque;
          border: 1px solid black;

          &:hover {
              background-color: orange;
          }
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
