<template>
    <div id="all" class="d-flex flex-column">
        <div id="post-container" class="w-xl-50">
            <h5 id="title">{{title}}</h5>
            <div id="content" v-if="content.length !== 0">{{content}}</div>
            <div id="image-container">
                <img id="image" :src="imgSrc"/>
            </div>
            <div id="video-section">
                <div id="video-container">
                    <iframe src="https://www.youtube.com/embed/klZNNUz4wPQ" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            <div id="votes">
                <div id="votes-number">Głosy: {{votes}}</div>
                <div id="userVote">{{userVote}}</div>
                <div id="vote-buttons">
                    <button id="vote-button" @click="voteUp"><img src="../assets/thumbup.png" alt="Głosuj na tak"></button>
                    <button id="vote-button" @click="voteDown"><img src="../assets/thumbdown.png" alt="Głosuj na nie"></button>
                </div>
            </div>
        </div>
        <div id="comments">
            <div id="comment"></div>
        </div>
    </div>
</template>

<script>
import postService from '../services/post';
import postVoteService from '../services/postvote';

export default {
  name: 'Post',
  data () {
      return {
          id: 0,
          title: "",
          content: "",
          creationDate: "",
          imgSrc: "",
          videoSrc: "",
          votes: 0,
          userVote: 0,
          message: ""
      }
  },
  created() {
      //Tu zapytanie do bazy zwracajace post po ID.
      this.id = this.$route.params.id;
      this.init();
  },
  methods: {
      async init() {
          this.getPost();
          this.getVotes();
          this.getUserVote();
      },
      async getPost() {
          let response = await postService.getPost(this.id);
          if("message" in response) {
              this.message = response.data.message;
          }
          else {
              this.title = response.data.title;
              this.content = response.data.content,
              this.creationDate = response.data.creation_date;
              this.imgSrc = response.data.image_path;
          }
      },
      async getVotes() {
          let response = await postVoteService.getVotes(this.id);
          if("message" in response) {
              this.message = response.data.message;
          }
          else {
              this.votes = parseInt(response.data.votes);
          }
      },
      async getUserVote() {
          let response = await postVoteService.getUserVote(this.id);
          if("message" in response) {
              this.message = response.data.message;
          }
          else {
              this.userVote = parseInt(response.data.vote);
          }
      },
      async voteUp() {
          if(this.userVote === 0) {
              let response = await postVoteService.vote(1, this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = 1;
                  this.votes += 1;
              }
          }
          else if(this.userVote === 1) {
              let response = await postVoteService.deleteVote(this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = 0;
                  this.votes += -1;
              }
          }
          else if(this.userVote === -1) {
              let response = await postVoteService.changeVote(1, this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = 1;
                  this.votes += 2;
              }
          }
      },
      async voteDown() {
          if(this.userVote === 0) {
              let response = await postVoteService.vote(-1, this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = -1;
                  this.votes -= 1;
              }
          }
          else if(this.userVote === -1) {
              let response = await postVoteService.deleteVote(this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = 0;
                  this.votes += 1;
              }
          }
          else if(this.userVote === 1) {
              let response = await postVoteService.changeVote(-1, this.id);
              if("message" in response) {
                  this.message = response.data.message;
              }
              else {
                  this.userVote = -1;
                  this.votes -= 2;
              }
          }
      }
  }
}
</script>

<style scoped lang="scss">

    #post-container {
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        border: 3px solid black;
        background-color: rgb(241, 223, 147);

        #votes {
            display: flex;
            flex-direction: column;
            justify-content: center;

            #votes-number {
                display: flex;
                justify-content: center;
                font-weight: bold;
            }

            #vote-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 50px;

                #vote-button {
                    img {
                        width: 50px;
                        height: 50px;
                        // opacity: 0.5;
                    }

                    margin: 0 5px;
                    background-color: bisque;
                    border: none;
                    background-color: transparent;
                }
            }
        }
    }

    #title {
        display: flex;
        justify-content: center;
        margin: 30px;
    }

    #content {
        display: flex;
        justify-content: center;
        margin: 0 auto;
        max-width: 70%;
        padding: 10px;
        word-wrap: break-word;
        border: 3px dotted black;
    }

    #image-container {
        display: flex;
        justify-content: center;
        margin: 20px 0;

        #image {
            max-width: 70%;
            height: auto;
            border: 3px solid black;
        }
    }

    #video-section {
        margin: auto;
        width: 70%;
        margin-bottom: 30px;
    
        #video-container {
            position: relative;
            padding-bottom: 56.25%;
            padding-top: 30px;
            overflow: hidden;
            border: 3px solid black;

            iframe, object, embed {
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
            }
        }
    }
    
</style>