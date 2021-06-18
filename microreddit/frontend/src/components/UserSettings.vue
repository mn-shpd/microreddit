<template>
    <form>
        <h2>Twoje dane</h2>
        <div class="mb-3">
            <label for="input-nick" class="form-label">Nazwa użytkownika</label>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="input-nick" :disabled="nickInputAccess ? 0 : 1" v-model="nickname">
                <button class="btn" type="button" v-if="nickInputAccess === false" @click="switchNickInputAccess">Zmień nazwę</button>
                <div id="changeOptions" v-else>
                    <button class="btn" type="button" @click="changeNickname">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchNickInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="input-email" class="form-label">Adres e-mail</label>
            <div class="input-group mb-3">
                <input type="email" class="form-control" id="input-email" :disabled="emailInputAccess ? 0 : 1" v-model="email">
                <button class="btn" type="button" v-if="emailInputAccess === false" @click="switchEmailInputAccess">Zmień e-mail</button>
                <div id="changeOptions" v-else>
                    <button class="btn" type="button" @click="changeEmail">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchEmailInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="input-password" class="form-label">Hasło</label>
            <div class="input-group mb-3">
                <input type="password" class="form-control" id="input-password" :disabled="passwordInputAccess ? 0 : 1" v-model="password">
                <button class="btn" type="button" v-if="passwordInputAccess === false" @click="switchPasswordInputAccess">Zmień hasło</button>
                <div id="changeOptions" v-else>
                    <button class="btn" type="button" @click="changePassword">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchPasswordInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
        <div :id="messageId">{{message}}</div>
    </form>
</template>

<script>
import userService from "../services/user";

export default {
  name: "UserSettings",
  data () {
      return {
          nickname: "",
          email: "",
          password: "",
          serverNickname: "",
          serverEmail: "",
          serverPassword: "",
          nickInputAccess: false,
          emailInputAccess: false,
          passwordInputAccess: false,
          message: "",
          messageId: "messageGreen"
      };
  },
  created() {
      this.loadUserSettings();
  },
  methods: {
      async loadUserSettings() {
          let response = await userService.getUserData();
          this.nickname = response.data.username;
          this.email = response.data.email;
          this.password = response.data.password;
          this.serverNickname = response.data.username;
          this.serverEmail = response.data.email;
          this.serverPassword = response.data.password;
      },
      async changeNickname() {
          let response = await userService.updateUserData(this.nickname, this.serverEmail, this.serverPassword);
          if("message" in response.data) {
              this.message = response.data.message;
              this.messageId = "messageRed";
          }
          else {
              this.serverNickname = this.nickname;
              this.switchNickInputAccess();
              this.message = "Pomyślnie zmieniono nazwę użytkownika.";
              this.messageId = "messageGreen";
          }
      },
      async changeEmail() {
          let response = await userService.updateUserData(this.serverNickname, this.email, this.serverPassword);
          if("message" in response.data) {
              this.message = response.data.message;
              this.messageId = "messageRed";
          }
          else {
              this.serverEmail = this.email;
              this.switchEmailInputAccess();
              this.message = "Pomyślnie zmieniono e-mail.";
              this.messageId = "messageGreen";
          }
      },
      async changePassword() {
          let response = await userService.updateUserData(this.serverNickname, this.serverEmail, this.password);
          if("message" in response.data) {
              this.message = response.data.message;
              this.messageId = "messageRed";
          }
          else {
              this.serverPassword = this.password;
              this.switchPasswordInputAccess();
              this.message = "Pomyślnie zmieniono hasło.";
              this.messageId = "messageGreen";
          }
      },
      switchNickInputAccess() {
          this.nickInputAccess = !this.nickInputAccess;
          this.nickname = this.serverNickname;
          this.message = "";
      },
      switchEmailInputAccess() {
          this.emailInputAccess = !this.emailInputAccess;
          this.email = this.serverEmail;
          this.message = "";
      },
      switchPasswordInputAccess() {
          this.passwordInputAccess = !this.passwordInputAccess;
          this.password = this.serverPassword;
          this.message = "";
      }
  }
};
</script>

<style scoped lang="scss">
    form {
        h2 {
            margin: 20px;
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

        #changeOptions {
            display: flex;
            gap: 5px;
        }

        #messageRed {
            color: red;
        }

        #messageGreen {
            color: green;
        }
    }
</style>