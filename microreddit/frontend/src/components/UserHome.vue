<template>
    <div id="content-container">
        <div id="global-message" v-if="!isLoaded">{{globalMessage}}</div>
        <div v-else>
            <nav v-if="entireNumberOfPostsToLoad !== 0" id="navbar">
                <div id="sort-section">
                    <h4>Sortowanie</h4>
                    <div id="sort-radios">
                        <div id="sort-by-section">
                            <input type="radio" id="sort-by-default-radio" value="default" v-model="sortOption" @change="sortPosts">
                            <label for="sort-by-default-radio">Domyślne</label>
                        </div>
                        <div id="sort-by-section">
                            <input type="radio" id="sort-by-votes-radio" value="votes" v-model="sortOption" @change="sortPosts">
                            <label for="sort-by-votes-radio">Według głosów</label>
                        </div>
                        <div id="sort-by-section">
                            <input type="radio" id="sort-by-newest-radio" value="newest" v-model="sortOption" @change="sortPosts">
                            <label for="sort-by-newest-radio">Według daty</label>
                        </div>
                    </div>
                </div>
            </nav>
            <div id="posts">
                <div id="message">{{message}}</div>
                <div id="cards" class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
                    <div class="col" v-for="(post, index) in posts" :key="post.id">
                        <div id="card" class="card h-100">
                            <div class="card-body">
                                <div id="card-header">
                                    <div id="card-headers">
                                        <h6 id="subreddit-name" @click="goToSubreddit(post.subreddit_name)">/{{post.subreddit_name}}</h6>
                                        <h5 id="card-title" class="card-title" @click="goToPost(post.id)">{{post.title}}</h5>
                                    </div>
                                    <button v-if="checkIfUserIsModeratorByName(post.subreddit_name)" @click="deletePost(post.id, index)"><img src="../assets/trash.png" alt="Usuń"></button>
                                </div>
                                <p id="card-text" class="card-text">{{post.content}}</p>
                            </div>
                            <div id="card-footer" class="card-footer">
                                <small id="creation-date" class="text-muted">{{formatDate(post.creation_date)}}</small>
                                <small>Głosy: <span :id="post.votes > 0 ? 'votes-green' : (post.votes < 0 ? 'votes-red' : '')">{{post.votes}}</span></small>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="load-more-container">
                    <button v-if="loadMoreVisibility" id="loadMoreButton" class="btn" type="button" @click="loadNextPosts">Załaduj więcej</button>
                </div>
                <div ref="bottom" id="bottom"></div>
            </div>
        </div>
    </div>
</template>

<script>
import postService from "../services/post";
import formatDateMixin from "../mixins/formatdate";
import { mapState } from "vuex";
import checkIfModerator from "../mixins/checkifmoderator";

export default {
  name: "Subreddit",
  data () {
      return {
          id: 0,
          posts: [],
          entireNumberOfPostsToLoad: 0,
          numberOfPostsToLoadAtOnce: 0,
          numberOfPostsAlreadyLoaded: 0,
          windowWidth: window.innerWidth,
          resizeId: 0,
          loadMoreVisibility: false,
          loadedMorePostsFlag: false,
          numberOfLoads: 0,
          sortOption: "",
          message: "",
          globalMessage: "Ładowanie postów...",
          isLoaded: false
      };
  },
  mixins: [formatDateMixin, checkIfModerator],
  computed: mapState([
    "loggedIn"
  ]),
  created() {
      this.init();
  },
  updated() {
    if(this.loadedMorePostsFlag && this.numberOfLoads > 1) {
        this.scrollToBottom();
        this.loadedMorePostsFlag = false;
    }
  },
  methods: {
      async init() {  
          if(this.loggedIn) {
              this.initSocketEvents();
              window.onresize = this.onResize;
              this.setNumberOfPostsToLoadAtOnce();
              await this.setEntireNumberOfPostsToLoad();
              this.globalMessage = "Ładowanie postów...";
              this.loadNextPosts().then(() => {
                  this.isLoaded = true;
              });
          }
          else {
              this.globalMessage = "Nie jesteś zalogowany.";
          }
      },
      async setEntireNumberOfPostsToLoad() {
          let response = await postService.getEntireNumberOfUserFollowedSubredditPosts();
          if("message" in response.data) {
              this.message = response.data.message;
              this.loadMoreVisibility = false;
          }
          else if(parseInt(response.data.amount) === 0) {
              this.message = "Brak postów do wyświetlenia. Obserwuj subreddit'y.";
              this.loadMoreVisibility = false;
          }
          else {
              this.entireNumberOfPostsToLoad = parseInt(response.data.amount);
          }
      },
      onResize() {
          clearTimeout(this.resizeId);
          this.resizeId = setTimeout(this.onResizeEnd, 250);
      },
      onResizeEnd() {
          this.windowWidth = window.innerWidth;
          this.setNumberOfPostsToLoadAtOnce();
      },
      setNumberOfPostsToLoadAtOnce() {
          if(this.windowWidth >= 1200) {
              this.numberOfPostsToLoadAtOnce = 12;
          }
          else if(this.windowWidth >= 768) {
              this.numberOfPostsToLoadAtOnce = 9;
          }
          else if(this.windowWidth >= 576) {
              this.numberOfPostsToLoadAtOnce = 6;
          }
          else {
              this.numberOfPostsToLoadAtOnce = 3;
          }
      },
      async loadNextPosts() {
          this.loadMoreVisibility = true;
          let response = await postService.getNumberOfUserFollowedSubredditPosts(this.numberOfPostsAlreadyLoaded, this.numberOfPostsToLoadAtOnce);
          if("message" in response.data) {
              this.message = response.data.message;
              this.loadMoreVisibility = false;
          }
          else {
              this.numberOfPostsAlreadyLoaded += response.data.length;
              this.posts = this.posts.concat(response.data);
              this.sortPosts();
              if(this.numberOfPostsAlreadyLoaded >= this.entireNumberOfPostsToLoad) {
                  this.loadMoreVisibility = false;
              }
              this.numberOfLoads++;
              this.loadedMorePostsFlag = true;
          }
      },
      sortPosts() {
          if(this.sortOption === "votes") {
              this.posts.sort((a, b) => (a.votes < b.votes) ? 1 : -1);
          }
          else if(this.sortOption === "newest") {
              this.posts.sort((a, b) => (a.creation_date < b.creation_date) ? 1 : -1);
          }
          else {
              this.posts.sort((a, b) => (a.id > b.id) ? 1 : -1);
          }
      },
      scrollToBottom() {
          let bottom = this.$refs.bottom;
          bottom.scrollIntoView();
      },
      async deletePost(id, index) {
          let response = await postService.deletePost(id);
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              let post = this.posts.splice(index, 1)[0];
              this.$socketio.emit("deletedPost", { subredditId: id, post });
          }
      },
      initSocketEvents(){
          this.$socketio.emit("joinUserHome");
          this.$socketio.on("postWasDeleted", (post) => {
              let index = this.posts.findIndex((el) => {
                  if(el.id === post.id) return true;
              });
              this.posts.splice(index, 1);
              if(this.posts.length === 0) {
                  this.message = "Nie dodano jeszcze żadnych postów.";
              }
          });
      },
      goToSubreddit(name) {
          this.$router.push("/subreddit/" + name);
      },
      goToPost(id) {
          this.$router.push("/post/" + id);
      }
  }
};
</script>

<style scoped lang="scss">

    #content-container {
        display: flex;
        flex-direction: column;
        width: 100%;

        #global-message {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        #navbar {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 0 30px 30px 30px;
            background-color: rgb(212, 214, 216);
            box-shadow: 4px 4px 4px grey;

            #sort-section {
                display: flex;
                flex-direction: column;
                align-items: center;

                h4 {
                    display: flex;
                    justify-content: center;
                }

                #sort-radios {
                    display: flex;
                    gap: 10px;

                    #sort-by-section {
                        display: flex;
                        gap: 3px;
                        align-items: center;

                        input {
                            margin-top: -3px;                          
                        }

                        label {
                            font-size: 0.80rem;
                            text-align: center;
                        }
                    }
                }
            }
        }

        #posts {
            display: flex;
            flex-direction: column;
            justify-content: center;

            #message {
                display: flex;
                justify-content: center;
                margin-top: 20px;

                &:empty {
                    margin-top: 0;
                }
            }

            #cards {
                margin: 0 10px;

                #card {
                    background-color: rgb(247, 243, 211);

                    #card-header {
                        display: flex;
                        justify-content: space-between;  

                        #subreddit-name {
                            &:hover {
                                cursor: pointer;
                            }
                        }                 

                        #card-title {
                            word-wrap: break-word;
                            white-space: normal;
                            text-align: justify;
                            text-justify: inter-word;
                            vertical-align: middle;
                            font-weight: bold;

                            &:hover {
                                cursor: pointer;
                            }
                        }

                        button {
                            background-color: bisque;
                            border: 1px solid black;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            
                            &:hover {
                                background-color: orange;
                            }

                            img {
                                width: 25px;
                                height: 25px;
                            }
                        }
                    }

                    #card-text {
                        text-align: justify;
                        text-justify: inter-word;
                        word-break: break-all;
                    }

                    #card-footer {
                        display: flex;
                        justify-content: space-between;

                        #creation-date {
                            display: flex;
                            justify-content: center;
                        }

                        #votes-green {
                            color: green;
                        }

                        #votes-red {
                            color: red;
                        }
                    }

                    &:hover {
                        background-color: rgb(247, 238, 173);
                    }
                }
            }

            #load-more-container {
                display: flex;
                justify-content: center;

                #loadMoreButton {
                    background-color: bisque;
                    border: 1px solid black;
                    margin-top: 30px;

                    &:hover {
                        background-color: orange;
                    }
                }
            }

            #bottom {
                margin-top: 30px;
            }
        }
    }

// na desktopie wyswietla navbar od razu. 
// na mobilnych po kliknieciu przycisku.
@media (min-width: 1200px) {

    #navbar {
        flex-direction: row;
        justify-content: center;
        gap: 50px;

        #sort-section {
            padding-top: 30px;
        }
    }
}

</style>