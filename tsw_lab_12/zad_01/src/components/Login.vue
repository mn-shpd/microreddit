<template>
    <form>
        <h1>Logowanie</h1>
        <div id="username">
            <label for="input-user">Username</label>
            <input type="text" id="input-nick" v-model="username">
        </div>
        <div id="password">
            <label for="input-password">Password</label>
            <input type="password" id="input-password" v-model="password">
        </div>
        <button type="button" @click="login">Zatwierdź</button>
    </form>
</template>

<script>
export default {
  name: 'Login',
  data () {
      return {
          username: "",
          password: ""
      }
  },
  methods: {
      async login() {
          const axios = require("axios");
          let response = await axios.post("http://localhost:3000/login", {
              username: this.username,
              password: this.password
          });
          console.log(response.data);
          if(response.data.loggedIn === true) {
              console.log("Udalo sie");
          }
      }
  }
}
</script>

<style scoped>

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #username {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #password {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    button {
        margin-top: 10px;
    }

    h1 {
        margin: 30px;
    }
</style>