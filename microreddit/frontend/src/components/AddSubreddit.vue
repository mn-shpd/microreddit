<template>
    <div id="content-container">
        <h2>Tworzenie subreddit'a</h2>
        <form>
            <div class="mb-3">
                <label for="input-name" class="form-label">Nazwa</label>
                <input type="text" class="form-control" id="input-name" v-model="name">
            </div>
            <div class="mb-3">
                <label for="input-description" class="form-label">Opis</label>
                <textarea class="form-control" id="input-description" v-model="description"></textarea>
                <!-- <input type="text" class="form-control" id="input-description" v-model="description"> -->
            </div>
            <div id="form-buttons">
                <button type="button" class="btn" @click="addSubreddit">Zatwierdź</button>
                <button type="button" class="btn" @click="cancel">Anuluj</button>
            </div>
            <div id="message"><pre>{{message}}</pre></div>
        </form>
    </div>
</template>

<script>
import subredditService from "../services/subreddit";
export default {
  name: "AddPost",
  data () {
      return {
          name: "",
          description: "",
          message: ""
      };
  },
  methods: {
      checkFields() {
          this.message = "";
          if(this.name.length === 0) {
              this.message += "Nie wypełniono pola z nazwą.\n";
          }
          else if(this.name.length > 256) {
              this.message += "Nazwa zbyt długa - maksymalna długość to 256 znaków.\n";
          }
          if(this.description.length === 0) {
              this.message += "Nie wypełniono pola z opisem.\n";
          }
          else if(this.description.length > 256) {
              this.message += "Opis zbyt długi - maksymalna długość to 256 znaków.\n";
          }

          if(this.message.length === 0) {
              return true;
          }
          else {
              return false;
          }
      },
      async addSubreddit() {
          //Gdy pola sa wypelnione poprawnie (brak komunikatów).
          if(this.checkFields()) {
              let response = await subredditService.addSubreddit(this.name, this.description);
              //Niepowodzenie.
              if("message" in response.data) {
                  this.message = response.data.message;
              }
              else {
                  this.$store.commit("addUserSubreddit", { id: response.data.id, name: response.data.name });
                  this.$router.push({ path: "/mysubreddits" });
              }
          }
      },
      cancel() {
          this.$router.go(-1);
      }
  }
};
</script>

<style scoped lang="scss">

    #content-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 30px 0;

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;

            #input-name {
                width: 300px;
                font-size: 12px;
            }

            #input-description {
                width: 300px;
                height: 150px;
                resize: none;
                font-size: 12px;
            }

            #form-buttons {
                display: flex;
                justify-content: space-evenly;
                width: 300px;
                margin-top: 10px;

                button {
                    background-color: bisque;
                    border: 1px solid black;

                    &:hover {
                        background-color: orange;
                    }
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
    }

</style>
