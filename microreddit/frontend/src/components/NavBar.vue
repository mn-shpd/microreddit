<template>
  <nav class="navbar">
    <div class="container-fluid">
      <a id="logo" class="navbar-brand" href="/">Micro<span id="red-logo-part">Red</span>dit</a>
      <form id="search-bar" class="d-xl-flex">
          <input id="search-input" type="text" class="form-control" v-model="searchString">
          <button id="search-input-button" class="btn" type="button" @click="search">Szukaj</button>
      </form>
      <div id="user-actions" class="d-xl-flex">
          <div v-if="loggedIn">Witaj, {{username}}!</div>
          <router-link id="userpanel" to="/usersettings" v-if="loggedIn">Profil</router-link>
          <router-link v-if="!loggedIn" id="login" to="/login" class="col">Logowanie</router-link>
          <router-link v-if="!loggedIn" id="register" to="/register" class="col">Rejestracja</router-link>
          <a v-if="loggedIn" id="logout" vtype="button" @click="logout">Wyloguj</a>
      </div>
      <div id="dropdown" class="nav-item dropdown d-xl-none">
          <a class="nav-link" href="#" id="navbar-dropdown-menu-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img id="dropdown-icon" src="../assets/dropdown.png"/>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbar-dropdown-menu-link">
            <li id="search-bar-dropdown">
              <input id="search-input-dropdown" type="text" class="form-control" v-model="searchString">
              <button id="search-input-button-dropdown" class="btn" type="button" @click="search">Szukaj</button>
            </li>
            <li v-if="loggedIn"><a class="dropdown-item" href="/usersettings">Profil</a></li>
            <li v-if="loggedIn"><a class="dropdown-item" href="/" @click="logout">Wyloguj</a></li>
            <li v-if="!loggedIn"><a class="dropdown-item" href="/login">Logowanie</a></li>
            <li v-if="!loggedIn"><a class="dropdown-item" href="/register">Rejestracja</a></li>
          </ul>
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
      this.$router.push("/subreddits");
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
      padding-left: 10px;

      #red-logo-part {
        color: red;
      }
    }

    #search-bar {
      width: 300px;
      display: none;

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
      display: none;

      #login, #register, #userpanel, #logout {
        color: white;
        margin: 0 10px;
        text-decoration: none;
      }

      #logout {
        cursor: pointer;
      }
    }

    #dropdown {

      #search-bar-dropdown {
        display: flex;
        padding: 10px;

        #search-input-dropdown {
          width: 150px;
        }

        #search-input-button-dropdown {
            display: flex;
            align-items: center;
            background-color: bisque;
            border: 1px solid black;

            &:hover {
                background-color: orange;
            }
        }
      }
    }
  }

@media (min-width: 350px) {
    nav{
      #logo {
        padding-left: 60px;
      }

      #dropdown {
        #search-bar-dropdown {

          #search-input-dropdown {
            width: 200px;
          }
        }
      }
    }
}

</style>
