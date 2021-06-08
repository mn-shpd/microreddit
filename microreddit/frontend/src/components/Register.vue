<template>
    <form>
        <h1>Rejestracja</h1>
        <div class="mb-3">
            <label for="input-nick" class="form-label">Nazwa użytkownika</label>
            <input type="text" class="form-control" id="input-nick" v-model="username">
        </div>
        <div class="mb-3">
            <label for="input-email" class="form-label">Adres e-mail</label>
            <input type="email" class="form-control" id="input-email" v-model="email">
        </div>
        <div class="mb-3">
            <label for="input-password" class="form-label">Hasło</label>
            <input type="password" class="form-control" id="input-password" v-model="password">
        </div>
        <div class="mb-3">
            <label for="input-password2" class="form-label">Powtórzone hasło</label>
            <input type="password" class="form-control" id="input-password2" v-model="password2">
        </div>
        <button type="button" class="btn" @click="register">Zatwierdź</button>
        <div id="message"><pre>{{message}}</pre></div>
    </form>
</template>

<script>
import userService from '../services/user';
export default {
  name: 'Register',
  data () {
      return {
          username: "",
          email: "",
          password: "",
          password2: "",
          message: ""
      }
  },
  methods: {
      checkFields() {
          this.message = "";
          if(this.username.length === 0) {
              this.message += "Nie wypełniono pola z nazwą użytkownika.\n";
          }
          if(this.email.length === 0) {
              this.message += "Nie wypełniono pola z e-mail'em.\n";
          }
          if(this.password.length === 0 || this.password2.length === 0) {
              this.message += "Nie wypełniono pola z hasłem.\n";
          }
          else if(this.password !== this.password2) {
              this.message += "Podane hasła są niezgodne.\n";
          }

          if(this.message.length === 0) {
              return true;
          }
          else {
              return false;
          }
      },
      async register() {
          //Gdy pola sa wypelnione poprawnie (brak komunikatów).
          if(this.checkFields()) {
              let response = await userService.register(this.email, this.username, this.password);
              //Niepowodzenie.
              if("message" in response.data) {
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
