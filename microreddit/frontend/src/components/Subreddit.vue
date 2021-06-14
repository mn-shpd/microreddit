<template>
    <div class="d-xl-flex flex-xl-column">
        <nav id="navbar" class="navbar">
            <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-content" aria-controls="navbar-content" aria-expanded="true" aria-label="Toggle navigation">
                Menu
            </button>
            <div class="collapse mt-xl-0" id="navbar-content">
                <div id="navbar-items" class="navbar-nav">
                    <div id="action-section">
                        <h4>Akcje</h4>
                        <router-link id="router-link" to="/addpost/1" class="btn nav-item" type="button">Dodaj post</router-link>
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
                                <label for="sort-by-popularity-radio">Popularne posty</label>
                            </div>
                            <div id="sort-by-section">
                                <input type="radio" id="sort-by-newest-radio" value="newest" v-model="sortOption" @change="sortPosts">
                                <label for="sort-by-newest-radio">Nowe posty</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div id="posts">
            <h2>Posty w ramach subreddit'a "{{name}}"</h2>
            <div id="message">{{message}}</div>
            <div id="cards" class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-4">
                <div class="col" v-for="post in posts" :key="post.id">
                    <div id="card" class="card h-100">
                        <div class="card-body">
                            <h5 id="card-title" class="card-title" @click="goToPost(post.id)">{{post.title}}</h5>
                            <p id="card-text" class="card-text">{{post.content}}</p>
                        </div>
                        <div class="card-footer">
                            <small id="creation-date" class="text-muted">{{formatDate(post.creation_date)}}</small>
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
</template>

<script>
import subredditService from '../services/subreddit';
import postService from '../services/post';
import formatDateMixin from '../mixins/formatdate';

export default {
  name: 'Subreddit',
  data () {
      return {
          name: "",
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
          message: ""
      }
  },
  mixins: [formatDateMixin],
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
              let response = await postService.getEntireNumberOfSubredditPosts(this.name);
              if("message" in response.data) {
                  this.message = response.data.message;
              }
              else {
                  this.entireNumberOfPostsToLoad = response.data.amount;
                  this.loadMoreVisibility = true;
                  this.setNumberOfPostsToLoadAtOnce();
                  this.loadNextPosts();
                  window.onresize = this.onResize;
              }
          }
      },
      async checkIfSubredditExists() {
          let response = await subredditService.getSubredditByName(this.name);
          if("message" in response.data) {
              this.message = response.data.message;
              return false;
          }
          if(response.data.length === 0) {
              this.message = "Subreddit o nazwie podanej w parametrze URL nie istnieje.";
              return false;
          }
          this.id = response.data[0].id;
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
              this.message = "Nie dodano jeszcze żadnych postów."
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
            //   this.posts.sort((a, b) => (a.creation_date < b.creation_date) ? 1 : -1);
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
      goToPost(id) {
          this.$router.push("/post/" + id);
      }
  }
}
</script>

<style scoped lang="scss">

    #navbar {
        display: flex;
        flex-direction: column;
        padding: 30px;
        background-color: rgb(212, 214, 216);

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

                    #router-link {
                        background-color: bisque;
                        border: 1px solid black;
                        width: 120px;

                        &:hover {
                            background-color: orange;
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

        h2 {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        #message {
            display: flex;
            justify-content: center;;
        }

        #cards {
            margin: 0 20px;

            #card {
                background-color: rgb(247, 243, 211);

                #card-title {
                    display: flex;
                    justify-content: center;

                    &:hover {
                        cursor: pointer;
                    }
                }

                #card-text {
                    text-align: justify;
                    text-justify: inter-word;
                }

                #creation-date {
                    display: flex;
                    justify-content: center;
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

// na desktopie wyswietla navbar od razu. 
// na mobilnych po kliknieciu przycisku.
@media (min-width: 1200px) {
    #navbar-content {
        display: block;
    }
}

</style>