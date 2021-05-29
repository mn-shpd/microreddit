<template>
    <form>
        <h2>Twoje dane</h2>
        <div class="mb-3">
            <label for="input-nick" class="form-label">Nazwa użytkownika</label>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="input-nick" :disabled="nickInputAccess ? 0 : 1" v-model="nickname">
                <button class="btn" type="button" v-if="nickInputAccess === false" @click="switchNickInputAccess">Zmień nazwę</button>
                <div v-else>
                    <button class="btn" type="button">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchNickInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="input-email" class="form-label">Adres e-mail</label>
            <div class="input-group mb-3">
                <input type="email" class="form-control" id="input-email" :disabled="emailInputAccess ? 0 : 1" v-model="email">
                <button class="btn" type="button" v-if="emailInputAccess === false" @click="switchEmailInputAccess">Zmień e-mail</button>
                <div v-else>
                    <button class="btn" type="button">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchEmailInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="input-password" class="form-label">Hasło</label>
            <div class="input-group mb-3">
                <input type="password" class="form-control" id="input-password" :disabled="passwordInputAccess ? 0 : 1" v-model="password">
                <button class="btn" type="button" v-if="passwordInputAccess === false" @click="switchPasswordInputAccess">Zmień hasło</button>
                <div v-else>
                    <button class="btn" type="button">Zatwierdź</button>
                    <button class="btn" type="button" @click="switchPasswordInputAccess">Anuluj</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
  name: 'UserSettings',
  data () {
      return {
          nickname: "mnshpd",
          email: "test@gmail.com",
          password: "blablabla",
          nickInputAccess: false,
          emailInputAccess: false,
          passwordInputAccess: false
      }
  },
  methods: {
      switchNickInputAccess() {
          this.nickInputAccess = !this.nickInputAccess;
      },
      switchEmailInputAccess() {
          this.emailInputAccess = !this.emailInputAccess;
      },
      switchPasswordInputAccess() {
          this.passwordInputAccess = !this.passwordInputAccess;
      }
  }
}
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
    }
</style>