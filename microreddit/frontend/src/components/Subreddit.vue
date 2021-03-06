<template>
    <div id="content-container"> 
        <div id="loading-info" v-if="!isLoaded">{{loadingInfo}}</div>
        <div v-else>
            <nav id="navbar" class="d-flex flex-xl-row">
                <div id="subreddit-info">
                    <label for="subreddit-name">Tytuł</label>
                    <h5 id="subreddit-name">{{name}}</h5>
                    <label for="subreddit-desc">Opis</label>
                    <h5 id="subreddit-desc">{{description}}</h5>
                    <div id="add-info">
                        <h6><img id="posts-icon" src="../assets/post.png"> {{postsTotal}}</h6>
                        <h6><img id="followers-icon" src="../assets/user.png"> {{followers}}</h6>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-content" aria-controls="navbar-content" aria-expanded="true" aria-label="Toggle navigation">
                        Menu
                    </button>
                    <div class="collapse mt-xl-0" id="navbar-content">
                        <div id="navbar-items" class="navbar-nav">
                            <div v-if="loggedIn" id="action-section">
                                <h4>Akcje</h4>
                                <div id="action-buttons">
                                    <router-link v-if="isModerator" id="router-link" :to="'/subredditedit/' + id" class="btn nav-item" type="button">Edytuj opis</router-link>
                                    <router-link id="router-link" :to="'/addpost/' + id" class="btn nav-item" type="button">Dodaj post</router-link>
                                    <div id="follow-buttons">
                                        <button v-if="!isFollowed" id="follow-button" class="btn" type="button" @click="follow()">Obserwuj</button>
                                        <button v-else id="unfollow-button" class="btn" type="button" @click="unfollow()">Nie obserwuj</button>
                                    </div>
                                </div>
                            </div>
                            <div id="sort-section">
                                <h4>Sortowanie</h4>
                                <div id="sort-radios">
                                    <div id="sort-by-section">
                                        <input type="radio" id="sort-by-default-radio" value="default" v-model="sortOption" @change="sortPosts">
                                        <label for="sort-by-default-radio">Domyślne</label>
                                    </div>
                                    <div id="sort-by-section">
                                        <input type="radio" id="sort-by-popularity-radio" value="popularity" v-model="sortOption" @change="sortPosts">
                                        <label for="sort-by-popularity-radio">Według głosów</label>
                                    </div>
                                    <div id="sort-by-section">
                                        <input type="radio" id="sort-by-newest-radio" value="newest" v-model="sortOption" @change="sortPosts">
                                        <label for="sort-by-newest-radio">Według daty</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div id="posts">
                <div id="message">{{message}}</div>
                <div id="cards" class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-4">
                    <div class="col" v-for="(post, index) in posts" :key="post.id">
                        <div id="card" class="card h-100">
                            <div class="card-body">
                                <div id="card-header">
                                    <h5 id="card-title" class="card-title" @click="goToPost(post.id)">{{post.title}}</h5>
                                    <button v-if="isModerator" @click="deletePost(post.id, index)"><img src="../assets/trash.png" alt="Usuń"></button>
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
import subredditService from "../services/subreddit";
import postService from "../services/post";
import formatDateMixin from "../mixins/formatdate";
import { mapState } from "vuex";
import subredditUserService from "../services/subreddituser";
import checkIfModerator from "../mixins/checkifmoderator";

export default {
  name: "Subreddit",
  data () {
      return {
          id: 0,
          name: "",
          description: "",
          posts: [],
          postsTotal: 0,
          followers: 0,
          entireNumberOfPostsToLoad: 0,
          numberOfPostsToLoadAtOnce: 0,
          numberOfPostsAlreadyLoaded: 0,
          windowWidth: window.innerWidth,
          resizeId: 0,
          loadMoreVisibility: false,
          loadedMorePostsFlag: false,
          numberOfLoads: 0,
          sortOption: "",
          isFollowed: false,
          isModerator: false,
          message: "",
          loadingInfo: "Ładowanie subreddit'a...",
          isLoaded: false
      };
  },
  mixins: [formatDateMixin, checkIfModerator],
  computed: mapState([
    "loggedIn"
  ]),
  created() {
      this.name = this.$route.params.name;
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
          if(await this.checkIfSubredditExists()) {
              this.checkIfUserFollows();
              this.isModerator = this.checkIfUserIsModeratorById(this.id);
              this.initSocketEvents();
              this.loadMoreVisibility = true;
              this.setNumberOfPostsToLoadAtOnce();
              this.loadNextPosts();
              window.onresize = this.onResize;
              this.isLoaded = true;
          }
      },
      async checkIfSubredditExists() {
          let response = await subredditService.getSubredditByName(this.name);
          if("message" in response.data) {
              this.loadingInfo = response.data.message;
              return false;
          }
          if(response.data.length === 0) {
              this.loadingInfo = "Subreddit o nazwie podanej w parametrze URL nie istnieje.";
              return false;
          }
          this.id = response.data.id;
          this.description = response.data.description;
          this.entireNumberOfPostsToLoad = response.data.posts;
          this.postsTotal = response.data.posts;
          this.followers = response.data.followers;
          return true;
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
          let response = await postService.getNumberOfSubredditPosts(this.name, this.numberOfPostsAlreadyLoaded, this.numberOfPostsToLoadAtOnce);
          if("message" in response.data) {
              this.message = response.data.message;
              this.loadMoreVisibility = false;
          }
          else if(response.data.length === 0 && this.numberOfPostsAlreadyLoaded === 0) {
              this.message = "Nie dodano jeszcze żadnych postów.";
              this.loadMoreVisibility = false;
          }
          else {
              this.numberOfPostsAlreadyLoaded += response.data.length;
              this.posts = this.posts.concat(response.data);
              this.sortPosts();
              if(this.numberOfPostsAlreadyLoaded >= parseInt(this.entireNumberOfPostsToLoad)) {
                  this.loadMoreVisibility = false;
              }
              this.numberOfLoads++;
              this.loadedMorePostsFlag = true;
          }
      },
      sortPosts() {
          if(this.sortOption === "popularity") {
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
      async checkIfUserFollows() {
          if(this.loggedIn) {
            let response = await subredditUserService.checkIfUserFollows(this.id);
            if("message" in response.data && this.loggedIn) {
                this.message = response.data.message;
            }
            else if(response.data.length === 0) {
                this.isFollowed = false;
            }
            else {
                this.isFollowed = true;
            }
          }
      },
      async follow() {
          let response = await subredditUserService.follow(this.id);
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              this.isFollowed = true;
              this.followers++;
          }
      },
      async unfollow() {
          let response = await subredditUserService.unfollow(this.id);
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              this.isFollowed = false;
              this.followers--;
          }
      },
      async deletePost(id, index) {
          let response = await postService.deletePost(id);
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else {
              let post = this.posts.splice(index, 1)[0];
              this.$socketio.emit("deletedPost", { subredditId: this.id, post });
              this.postsTotal--;
          }
      },
      initSocketEvents(){
          this.$socketio.emit("joinSubreddit", this.id);
          this.$socketio.on("postWasDeleted", (post) => {
              let index = this.posts.findIndex((el) => {
                  if(el.id === post.id) return true;
              });
              this.posts.splice(index, 1);
              this.postsTotal--;
              if(this.posts.length === 0) {
                  this.message = "Nie dodano jeszcze żadnych postów.";
              }
          });
          this.$socketio.on("newPost", (post) => {
              this.posts.push(post);
              this.postsTotal++;
              if(this.posts.length === 0) {
                  this.message = "Nie dodano jeszcze żadnych postów.";
              }
              this.sortPosts();
          });
      },
      goToPost(id) {
          this.$router.push("/post/" + id);
      }
  }
};
</script>

<style scoped lang="scss">

#content-container {
    #loading-info {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    #navbar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 30px;
        background-color: rgb(212, 214, 216);
        box-shadow: 4px 4px 8px grey, -2px 0 4px grey;   

        #subreddit-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 450px;
            
            #subreddit-name, #subreddit-desc {
                word-break: break-all;
                font-size: 15px;
            }

            #add-info {
                display: flex;
                gap: 25px;

                #posts-icon {
                    width: 24px;
                    height: 24px;
                }
            }
        }

        #menu-button {
            background-color: bisque;
            border: 1px solid black;
            width: 70px;
            display: flex;
            justify-content: center;

            &:hover {
                background-color: orange;
            }
        }

        #navbar-content {
            margin-top: 20px;

            #navbar-items {
                display: flex;
                flex-direction: row;
                gap: 30px;

                #action-section {
                    h4 {
                        display: flex;
                        justify-content: center;
                    }

                    #action-buttons {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;

                        #router-link, button {
                            background-color: bisque;
                            border: 1px solid black;
                            width: 130px;

                            &:hover {
                                background-color: orange;
                            }
                        }
                    }
                }

                #sort-section {
                    h4 {
                        display: flex;
                        justify-content: center;
                    }

                    #sort-radios {
                        display: flex;
                        flex-direction: column;

                        #sort-by-section {
                            display: flex;
                            gap: 5px;
                            align-items: center;
                        }
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
        }

        #cards {
            margin: 0 20px;

            #card {
                background-color: rgb(247, 243, 211);

                #card-header {
                    display: flex;
                    justify-content: space-between;                   

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

        #navbar-content {
            display: block;
        }
    }

}

</style>