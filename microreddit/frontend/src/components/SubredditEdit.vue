<template>
   <div id="content-container">
        <h2>Edycja subreddit'a</h2>
        <form>
            <div class="mb-3">
                <label for="input-name" class="form-label">Nazwa</label>
                <input type="text" class="form-control" id="input-name" v-model="name" disabled>
            </div>
            <div class="mb-3">
                <label for="input-description" class="form-label">Opis</label>
                <textarea class="form-control" id="input-description" v-model="description"></textarea>
            </div>
            <div id="form-buttons">
                <button type="button" class="btn" @click="edit">Zatwierdź</button>
                <button type="button" class="btn" @click="cancel">Anuluj</button>
            </div>
            <div id="message"><pre>{{message}}</pre></div>
        </form>
    </div>
</template>

<script>
import subredditService from "../services/subreddit";
export default {
  name: "SubredditEdit",
  data () {
      return {
          id: 0,
          name: "",
          desc: "",
          message: ""
      };
  },
  created() {
      this.id = this.$route.params.id;
      this.checkIfSubredditExists();
  },
  methods: {
      async checkIfSubredditExists() {
          let response = await subredditService.getSubredditById(this.id);
          if("message" in response.data) {
              this.message = response.data.message;
              return false;
          }
          if(response.data.length === 0) {
              this.message = "Subreddit o nazwie podanej w parametrze URL nie istnieje.";
              return false;
          }
          this.name = response.data.name;
          this.description = response.data.description;
          return true;
      },
      checkFields() {
          this.message = "";
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
      async edit() {
          if(this.checkFields()) {
            let response = await subredditService.updateSubreddit(this.id, this.description);
            if("message" in response.data) {
                this.message = response.data.message;
            }
            else {
                this.$router.push({ path: `/subreddit/${this.name}` });
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