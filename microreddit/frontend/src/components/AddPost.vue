<template>
    <form>
        <h1>Tworzenie posta</h1>
        <div class="mb-3">
            <label for="input-title" class="form-label">Tytuł</label>
            <input type="text" class="form-control" id="input-title" v-model="title">
        </div>
        <div class="mb-3">
            <label for="input-content" class="form-label">Treść</label>
            <textarea class="form-control" id="input-content" v-model="content"></textarea>
        </div>
        <div class="mb-3">
            <label for="input-img" class="form-label">Zdjęcie</label>
            <input ref="img" type="file" @change="onImgSelect" class="form-control" id="input-img">
        </div>
        <div class="mb-3">
            <label for="input-ytlink" class="form-label">YouTube wideo (URL)</label>
            <input type="text" class="form-control" id="input-ytlink" v-model="ytUrl">
        </div>
        <div id="buttons">
            <button type="button" class="btn" @click="addPost">Zatwierdź</button>
            <button type="button" class="btn" @click="cancel">Anuluj</button>
        </div>
        <div id="message"><pre>{{message}}</pre></div>
    </form>
</template>

<script>
import postService from "../services/post";
import youtubeVideo from "../mixins/youtubevideo";

export default {
  name: "AddPost",
  data () {
      return {
          subredditId: 0,
          title: "",
          content: "",
          img: "",
          ytUrl: "",
          message: "",
      };
  },
  mixins: [youtubeVideo],
  created() {
      this.subredditId = parseInt(this.$route.params.subredditId);
  },
  methods: {
      onImgSelect() {
          const img = this.$refs.img.files[0];
          this.img = img;
      },
      checkFields() {
          this.message = "";
          if(this.title.length === 0) {
              this.message += "Nie wypełniono pola z tytułem.\n";
          }
          else if(this.title.length > 256) {
              this.message += "Tytuł zbyt długi - maksymalna długość to 256 znaków.\n";
          }
          if(this.content.length === 0) {
              this.message += "Nie wypełniono pola z treścią.\n";
          }
          if(this.ytUrl.length !== 0) {
              if(!this.checkYtUrl(this.ytUrl)) {
                  this.message += "Niepoprawny format YouTube wideo URL.\n";
              }
          }

          if(this.message.length === 0) {
              return true;
          }
          else {
              return false;
          }
      },
      addPost() {
          //Gdy pola sa wypelnione poprawnie (brak komunikatów).
          if(this.checkFields()) {
            if(this.img === "") {
                this.addPostWithoutImg();
            }
            else {
                this.addPostWithImg();
            }
          }
      },
      async addPostWithImg() {
          let response = await postService.addPostWithImg(this.title, this.content, this.img, this.ytUrl, this.subredditId);
          //Niepowodzenie.
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              this.$router.push({ path: `/post/${response.data.id}`});
          }
      },
      async addPostWithoutImg() {
          let response = await postService.addPost(this.title, this.content, this.ytUrl, this.subredditId);
          //Niepowodzenie.
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              this.$router.push({ path: `/post/${response.data.id}`});
          }
      },
      cancel() {
          this.$router.go(-1);
      }
  }
};
</script>

<style scoped lang="scss">

    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
            margin: 30px;
        }

        input, textarea {
            width: 300px;
            resize: none;
            font-size: 12px;
        }

        #buttons {
            display: flex;
            width: 300px;
            justify-content: space-evenly;

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
</style>
