<template>
    <div id="content-container" class="d-flex flex-lg-row align-items-lg-start">
        <div v-if="!postLoaded">Ładowanie posta...</div>
        <div v-if="postLoaded" id="post-container">
            <div id="creation-date-container">
                <img id="calendar-icon" src="../assets/calendar.png"/>
                <div id="creation-date">{{formatDate(creationDate)}}</div>
                <div> - <span id="author">{{author}}</span></div>
            </div>
            <div id="title">{{title}}</div>
            <div id="content" v-html="content"></div>
            <div id="media-container">
                <div id="image-container">
                    <a target="_blank" :href="imgSrc"><img id="image" :src="imgSrc"/></a>
                </div>
                <div v-if="videoSrc.length !== 0" id="video-section">
                    <div id="video-container">
                        <iframe :src="videoSrc" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            <div id="votes">
                <div id="votes-number">Głosy: {{votes}}</div>
                <div v-if="loggedIn" id="vote-buttons">
                    <button id="vote-button" @click="voteUp"><img :src="voteUpIconSrc" alt="Głosuj na tak"></button>
                    <button id="vote-button" @click="voteDown"><img :src="voteDownIconSrc" alt="Głosuj na nie"></button>
                </div>
            </div>
        </div>
        <div v-if="postLoaded" id="comments-container">
            <div id="comments-header">Komentarze</div>
            <div v-if="loggedIn" id="comment-input-container" class="input-group mb-3">
                <input id="comment-input" type="text" class="form-control" v-model="newComment">
                <button id="comment-input-button" class="btn" type="button" @click="addComment">Wyślij</button>
            </div>
            <div id="comments-message" v-if="commentsMessage.length !== 0">{{commentsMessage}}</div>
            <div id="comments-section">
                <div id="comments" v-for="(comment, index) in comments" :key="comment.id">
                    <Comment :isModerator="isModerator" :id="comment.id" :author="comment.nickname" :content="comment.content" @onDelete="deleteComment(index, $event)"/>
                </div>
            </div>
            <button v-if="loadMoreVisibility" id="load-more-button" class="btn" type="button" @click="loadNextComments">Załaduj więcej</button>
        </div>
    </div>
</template>

<script>
import postService from "../services/post";
import postVoteService from "../services/postvote";
const thumbUp = require("../assets/thumbup.png");
const thumbDown = require("../assets/thumbdown.png");
const thumbUpGreen = require("../assets/thumbupgreen.png");
const thumbDownRed = require("../assets/thumbdownred.png");
import formatDateMixin from "../mixins/formatdate";
import Comment from "../components/Comment.vue";
import commentService from "../services/comment";
import checkIfModerator from "../mixins/checkifmoderator";
import youtubeVideo from "../mixins/youtubevideo";
import { mapState } from "vuex";
import wrapUrls from "../mixins/wrapurls";

export default {
  name: "Post",
  components: {
      Comment
  },
  data () {
      return {
          postLoaded: false,
          id: 0,
          title: "",
          content: "",
          creationDate: "",
          imgSrc: "",
          videoSrc: "",
          subredditId: 0,
          author: "",
          votes: 0,
          userVote: 0,
          voteUpIconSrc: thumbUp,
          voteDownIconSrc: thumbDown,
          newComment: "",
          comments: [],
          entireNumberOfComments: 0,
          numberOfCommentsToLoadAtOnce: 9,
          numberOfCommentsAlreadyLoaded: 0,
          loadMoreVisibility: true,
          message: "",
          commentsMessage: ""
      };
  },
  mixins: [formatDateMixin, checkIfModerator, youtubeVideo, wrapUrls],
  computed: mapState([
    "loggedIn"
  ]),
  created() {
      this.id = this.$route.params.id;
      this.init();
  },
  methods: {
      init() {
          Promise.all([this.getPost(), this.getVotes(), this.getUserVote(), this.setEntireNumberOfComments()]).then(() => {
              this.postLoaded = true;
              this.isModerator = this.checkIfUserIsModeratorById(this.subredditId);
              this.initSocketEvents();
              this.loadNextComments();
          });
      },
      async getPost() {
          let response = await postService.getPost(this.id);
          if("message" in response) {
              this.message = response.data.message;
          }
          else {
              this.title = response.data.title;
              this.content = this.wrapUrls(response.data.content), 
              this.creationDate = response.data.creation_date;
              if(response.data.video_url !== null && response.data.video_url.length !== 0) {
                this.videoSrc = "https://www.youtube.com/embed/" + this.getVideoId(response.data.video_url);
              }
              this.imgSrc = response.data.image_path;
              this.subredditId = response.data.subreddit_id;
              this.author = response.data.nickname;
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
          this.setVoteIconsSrcs();
      },
      setVoteIconsSrcs() {
          if(this.userVote === 0) {
              this.voteUpIconSrc = thumbUp;
              this.voteDownIconSrc = thumbDown;
          }
          else if(this.userVote === 1) {
              this.voteUpIconSrc = thumbUpGreen;
              this.voteDownIconSrc = thumbDown;
          }
          else if(this.userVote === -1) {
              this.voteUpIconSrc = thumbUp;
              this.voteDownIconSrc = thumbDownRed;
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
                  this.socketVote(1);
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
                  this.socketVote(-1);
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
                  this.socketVote(2);
              }
          }
          this.setVoteIconsSrcs();
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
                  this.socketVote(-1);
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
                  this.socketVote(1);
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
                  this.socketVote(-2);
              }
          }
          this.setVoteIconsSrcs();
      },
      socketVote(vote) {
          this.$socketio.emit("voted", { postId: this.id, vote: vote });
      },
      async setEntireNumberOfComments() {
          let response = await commentService.getEntireNumberOfComments(this.id);
          if("message" in response.data) {
              this.commentsMessage = response.data.message;
              this.loadMoreVisibility = false;
          }
          else {
              this.entireNumberOfComments = parseInt(response.data.total);
              if(this.entireNumberOfComments === 0) {
                  this.commentsMessage = "Nie ma jeszcze komentarzy do tego posta.";
              }
          }
      },
      async loadNextComments() {
        //   this.commentsMessage = "";
          let response = await commentService.getNumberOfComments(this.id, this.numberOfCommentsAlreadyLoaded, this.numberOfCommentsToLoadAtOnce);
          if("message" in response.data) {
              this.commentsMessage = response.data.message;
              this.loadMoreVisibility = false;
          }
          else {
              this.numberOfCommentsAlreadyLoaded += response.data.length;
              this.comments = this.comments.concat(response.data);
              if(this.numberOfCommentsAlreadyLoaded >= this.entireNumberOfComments) {
                  this.loadMoreVisibility = false;
              }
          }
      },
      async addComment() {
          this.commentsMessage = "";
          if(this.newComment.length !== 0) {
            let response = await commentService.addComment(this.id, this.newComment);
            if("message" in response.data) {
                this.commentsMessage = response.data.message;
            }
            else {
                let comment = {
                    id: response.data.id,
                    content: response.data.content,
                    nickname: response.data.nickname
                };
                this.comments.unshift(comment);
                this.entireNumberOfComments += 1;
                this.$socketio.emit("addedComment", { postId: this.id, comment});
            }
          }
          else {
              this.commentsMessage = "Nie wprowadzono komentarza.";
          }
      },
      deleteComment(index, data) {
          if(data.success) {
              let comment = this.comments.splice(index, 1);
              this.$socketio.emit("deletedComment", { postId: this.id, comment: comment[0] });
              if(this.comments.length === 0) {
                  this.commentsMessage = "Nie ma jeszcze komentarzy do tego posta.";
              }
          }
          else {
              this.commentsMessage = data.message;
          }
      },
      initSocketEvents() {
          this.$socketio.emit("joinPost", this.id);
          this.$socketio.on("commentWasDeleted", (comment) => {
              let index = this.comments.findIndex((el) => {
                  if(el.id === comment.id) return true;
              });
              this.comments.splice(index, 1);
              if(this.comments.length === 0) {
                  this.commentsMessage = "Nie ma jeszcze komentarzy do tego posta.";
              }
          });
          this.$socketio.on("commentWasAdded", (comment) => {
              this.comments.unshift(comment);
              this.commentsMessage = "";
          });
          this.$socketio.on("postWasDeleted", () => {
              this.$router.go(-1);
          });
          this.$socketio.on("someoneVoted", (vote) => {
              this.votes += vote;
          });
      }
  }
};
</script>

<style scoped lang="scss">
$headers-size: 30px;

    ::-webkit-scrollbar {
        width: 15px;
    }

    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: red; 
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #b30000; 
    }

    #content-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 40px 0;
        gap: 20px;

        #post-container {
            display: flex;
            flex-direction: column;
            min-height: 90vh;
            width: 40%;
            background-color: white;
            box-shadow: 4px 4px 8px grey, -2px 0 4px grey;
            border-radius: 7px;
            padding: 0 15px;

            #creation-date-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;

                #calendar-icon {
                    display: flex;
                    margin-top: -4px;
                }

                #creation-date {
                    margin: 0;
                    padding: 0;
                }
            }

            #title {
                font-size: $headers-size;
                font-weight: bold;
            }

            #content {
                text-align: justify;
                text-justify: inter-word;
            }

            #media-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                margin: 20px 0;

                #image-container {
                    display: flex;
                    justify-content: center;
                    img {
                        width: 100%;
                        box-shadow: 4px 4px 8px grey, -2px 0 4px grey;
                        border-radius: 7px;
                    }
                }

                #video-container {
                    iframe {
                        width: 100%;
                        box-shadow: 4px 4px 8px grey, -2px 0 4px grey;
                        border-radius: 7px;
                    }
                }
            }

            #creation-date-container {
                display: flex;
                justify-content: center;
                margin-top: 15px;

                #creation-date {
                    font-weight: bold;
                    opacity: 0.7;
                }

                #author {
                    color: red;
                }
            }

            #votes {
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 30px;
                margin: 10px 0;

                #votes-number {
                    display: flex;
                    justify-content: center;
                    font-weight: bold;
                }

                #vote-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 30px;

                    #vote-button {
                        border: none;
                        background-color: transparent;
                    }
                }
            }
        }

        #comments-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 90vh;
            max-height: 90vh;
            width: 40%;
            background-color: white;
            box-shadow: 4px 2px 8px grey, -2px 0 4px grey;
            border-radius: 7px;
            padding: 15px;

            #comments-header {
                display: flex;
                justify-content: center;
                font-size: $headers-size;
                margin-bottom: 5px;
            }

            #comment-input-container {
                display: flex;
                width: 90%;

                #comment-input-button {
                    display: flex;
                    align-items: center;
                    background-color: bisque;
                    border: 1px solid black;

                    &:hover {
                        background-color: orange;
                    }
                }
            }

            #comments-message {
                margin-bottom: 10px;
            }

            #comments-section {
                padding: 3px;
                overflow-y: auto;
                width: 90%;
                min-height: 90%;
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 20px;
            }

            #load-more-button {
                background-color: bisque;
                border: 1px solid black;
                margin: 10px 0;

                &:hover {
                    background-color: orange;
                }
            }
        }
    }

@media (max-width: 500px) {

    #content-container {
        #post-container {
            #media-container {
                flex-direction: column;
            }
        }
    }
}

@media (max-width: 991px) {

    #content-container {

        #post-container, #comments-container {
            width: 90%;
            min-height: none;
        }
    }
}
    
</style>