<template>
    <form>
        <h1>Tworzenie posta</h1>
        <div class="mb-3">
            <label for="input-title" class="form-label">Tytuł</label>
            <input type="text" class="form-control" id="input-title" v-model="title">
        </div>
        <div class="mb-3">
            <label for="input-content" class="form-label">Treść</label>
            <input type="email" class="form-control" id="input-content" v-model="content">
        </div>
        <div class="mb-3">
            <label for="input-img" class="form-label">Zdjęcie</label>
            <input ref="img" type="file" @change="onImgSelect" class="form-control" id="input-img">
        </div>
        <div class="mb-3">
            <label for="input-ytlink" class="form-label">YouTube wideo (URL)</label>
            <input type="text" class="form-control" id="input-ytlink" v-model="ytUrl">
        </div>
        <button type="button" class="btn" @click="addPost">Zatwierdź</button>
        <button type="button" class="btn" @click="cancel">Anuluj</button>
        <div id="message"><pre>{{message}}</pre></div>
        <img :src="myimg"/>
    </form>
</template>

<script>
import postService from "../services/post";
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
          if(this.content.length === 0) {
              this.message += "Nie wypełniono pola z treścią.\n";
          }

          if(this.message.length === 0) {
              return true;
          }
          else {
              return false;
          }
      },
      async addPost() {
          //Gdy pola sa wypelnione poprawnie (brak komunikatów).
          if(this.checkFields()) {
              let response = await postService.addPost(this.title, this.content, this.img, this.ytUrl, this.subredditId);
              //Niepowodzenie.
              if("message" in response.data) {
                  this.message = response.data.message;
              }
              else {
                  console.log(response.data);
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
