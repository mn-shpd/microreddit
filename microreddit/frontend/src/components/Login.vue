<template>
    <form>
        <h1>Logowanie</h1>
        <div class="mb-3">
            <label for="input-email" class="form-label">Adres e-mail</label>
            <input type="text" class="form-control" id="input-email" v-model="email">
        </div>
        <div class="mb-3">
            <label for="input-password" class="form-label">Hasło</label>
            <input type="password" class="form-control" id="input-password" v-model="password">
        </div>
        <button type="button" class="btn" @click="login">Zatwierdź</button>
        <div id="message">{{message}}</div>
    </form>
</template>

<script>
import userService from '../../services/user';

export default {
  name: 'Login',
  data () {
      return {
          email: "",
          password: "",
          message: ""
      }
  },
  methods: {
      async login() {
          if(this.email.length === 0) {
              this.message = "Nie podano e-mail.";
          }
          else if(this.password.length === 0) {
              this.message = "Nie podano hasła.";
          }
          else {
            let response = await userService.login(this.email, this.password);
            //Niepowodzenie.
            if(!response.data.auth) {
                this.message = response.data.message;
            }
            else {
                this.$router.push("/");
            }
          }
      }
  }
}
</script>

<style scoped lang="scss">

    form {
        h1 {
            margin: 30px;
        }

        display: flex;
        flex-direction: column;
        align-items: center;

        button {
            background-color: bisque;
            border: 1px solid black;

            &:hover {
                background-color: orange;
            }
        }

        #message {
            display: flex;
            justify-content: center;
            text-align: center;
            color: red;
            margin-top: 20px;
        }
    }
</style>