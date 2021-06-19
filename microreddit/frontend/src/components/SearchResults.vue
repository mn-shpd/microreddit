<template>
    <div id="content-container">
        <div id="message" v-if="message.length !== 0">{{message}}</div>
        <div id="search-results-container" class="d-xl-flex flex-xl-row align-items-xl-start" v-else>
            <div id="subreddits-container" class="row row-cols-1">
                <h2 id="subreddits-header">Subreddit'y</h2>
                <div id="subreddits-message" v-if="subredditsMessage.length !== 0">{{subredditsMessage}}</div>
                <div id="subreddits-cards" class="col" v-for="subreddit in subreddits" :key="subreddit.id" v-else>
                    <div id="card" class="card h-100">
                        <div class="card-body">
                            <h5 id="subreddit-title" class="card-title" @click="goToSubreddit(subreddit.name)">{{subreddit.name}}</h5>
                            <p class="card-text">{{subreddit.description}}</p>
                        </div>
                    </div>
                </div>
                <button v-if="loadMoreSubsVisibility" id="load-more-subs-button" class="btn" type="button" @click="loadNextSearchedSubs">Załaduj więcej</button>
            </div>
            <div id="posts-container" class="row row-cols-1">
                <h2 id="posts-header">Posty</h2>
                <div id="posts-message" v-if="postsMessage.length !== 0">{{postsMessage}}</div>
                <div id="posts-cards" class="col" v-for="post in posts" :key="post.id" v-else>
                    <div id="card" class="card h-100">
                        <div class="card-body">
                            <h5 id="post-title" class="card-title" @click="goToPost(post.id)">{{post.title}}</h5>
                            <p class="card-text">{{trimPostContent(post.content)}}</p>
                        </div>
                    </div>
                </div>
                <button v-if="loadMorePostsVisibility" id="load-more-posts-button" class="btn" type="button" @click="loadNextSearchedPosts">Załaduj więcej</button>
            </div>
        </div>
    </div>
</template>

<script>
import formatDateMixin from "../mixins/formatdate";
import trimPostContent from "../mixins/trimpostcontent";
import subredditService from "../services/subreddit";
import postService from "../services/post";

export default {
  name: "SearchResults",
  data () {
      return {
          searchString: "",
          subreddits: [],
          entireNumberOfSearchedSubs: 0,
          numberOfSubsToLoadAtOnce: 10,
          numberOfSubsAlreadyLoaded: 0,
          loadMoreSubsVisibility: true,
          posts: [],
          entireNumberOfSearchedPosts: 0,
          numberOfPostsToLoadAtOnce: 10,
          numberOfPostsAlreadyLoaded: 0,
          loadMorePostsVisibility: true,
          subredditsMessage: "",
          postsMessage: "",
          message: "",
      };
  },
  mixins: [formatDateMixin, trimPostContent],
  watch: {
    "$route.query.searchString": function () {
        this.init();
    }
  },
  created() {
      this.init();
  },
  methods: {
      init() {
          this.message = "Ładowanie wyników...";
          this.subredditsMessage = "";
          this.postsMessage = "";
          if(this.setSearchString()) {
            Promise.all([this.setEntireNumberOfSearchedSubs(), this.setEntireNumberOfSearchedPosts()]).then(() => {
                this.message = "";
                this.subreddits = [];
                this.posts = [];
                this.numberOfSubsAlreadyLoaded = 0;
                this.numberOfPostsAlreadyLoaded = 0;
                this.loadMoreSubsVisibility = true;
                this.loadMorePostsVisibility = true;
                this.loadNextSearchedSubs();
                this.loadNextSearchedPosts();
            });
          }
      },
      setSearchString() {
          if("searchString" in this.$route.query) {
            this.searchString = this.$route.query.searchString;
            return true;
          }
          else {
            this.message = "Brak parametru query 'searchString' w URL.";
            return false;
          }
      },
      async setEntireNumberOfSearchedSubs() {
          let response = await subredditService.getSearchedSubredditsTotal(this.searchString);
          if("message" in response.data) {
              this.subredditsMessage = response.data.message;
              this.loadMoreSubsVisibility = false;
          }
          else {
              this.entireNumberOfSearchedSubs = parseInt(response.data.total);
              if(this.entireNumberOfSearchedSubs === 0) {
                  this.subredditsMessage = `Brak subreddit'ów zawierających w nazwie '${this.searchString.toLowerCase()}'.`;
              }
          }
      },
      async loadNextSearchedSubs() {
          let response = await subredditService.getNumberOfSearchedSubreddits(this.searchString, this.numberOfSubsAlreadyLoaded, this.numberOfSubsToLoadAtOnce);
          if("message" in response.data) {
              this.subredditsMessage = response.data.message;
              this.loadMoreSubsVisibility = false;
          }
          else {
              this.numberOfSubsAlreadyLoaded += response.data.length;
              this.subreddits = this.subreddits.concat(response.data);
              if(this.numberOfSubsAlreadyLoaded >= this.entireNumberOfSearchedSubs) {
                  this.loadMoreSubsVisibility = false;
              }
          }
      },
      async setEntireNumberOfSearchedPosts() {
          let response = await postService.getSearchedPostsTotal(this.searchString);
          if("message" in response.data) {
              this.postsMessage = response.data.message;
              this.loadMorePostsVisibility = false;
          }
          else {
              this.entireNumberOfSearchedPosts = parseInt(response.data.total);
              if(this.entireNumberOfSearchedPosts === 0) {
                  this.postsMessage = `Brak postów zawierających w treści '${this.searchString.toLowerCase()}'.`;
              }
          }
      },
      async loadNextSearchedPosts() {
          let response = await postService.getNumberOfSearchedPosts(this.searchString, this.numberOfPostsAlreadyLoaded, this.numberOfPostsToLoadAtOnce);
          if("message" in response.data) {
              this.postsMessage = response.data.message;
              this.loadMorePostsVisibility = false;
          }
          else {
              this.numberOfPostsAlreadyLoaded += response.data.length;
              this.posts = this.posts.concat(response.data);
              if(this.numberOfPostsAlreadyLoaded >= this.entireNumberOfSearchedPosts) {
                  this.loadMorePostsVisibility = false;
              }
          }
      },
      goToSubreddit(name) {
          this.$router.push({ path: `/subreddit/${name}`});
      },
      goToPost(id) {
          this.$router.push({ path: `/post/${id}`});
      }
  }

};
</script>

<style scoped lang="scss">

    #content-container {
        display: flex;
        justify-content: center;
        margin: 40px 0;

        #search-results-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 40px;

            #subreddits-container {
                display: flex;
                justify-content: center;
                width: 450px;
                background-color: white;
                box-shadow: 4px 4px 8px grey, -2px 0 4px grey;
                border-radius: 7px;
                padding: 20px 15px;

                #subreddits-cards {
                    margin: 3px 0;

                    #card {
                        background-color: rgb(247, 243, 211);
                        
                        #subreddit-title:hover {
                            color: dimgray;
                            cursor: pointer;
                        }

                        &:hover {
                            background-color: rgb(247, 238, 173);
                        }
                    }
                }

                #load-more-subs-button {
                    display: flex;
                    justify-content: center;
                    background-color: bisque;
                    border: 1px solid black;
                    width: 140px;
                    margin-top: 15px;

                    &:hover {
                        background-color: orange;
                    }
                }
            }

            #posts-container {
                display: flex;
                justify-content: center;
                width: 450px;
                background-color: white;
                box-shadow: 4px 4px 8px grey, -2px 0 4px grey;
                border-radius: 7px;
                padding: 20px 15px;

                #posts-cards {
                    margin: 3px 0;

                    #card {
                        background-color: rgb(247, 243, 211);
                        
                        #post-title:hover {
                            color: dimgray;
                            cursor: pointer;
                        }

                        &:hover {
                            background-color: rgb(247, 238, 173);
                        }
                    }
                }

                #load-more-posts-button {
                    display: flex;
                    justify-content: center;
                    background-color: bisque;
                    border: 1px solid black;
                    width: 140px;
                    margin-top: 15px;

                    &:hover {
                        background-color: orange;
                    }
                }
            }
        }
    }
    
</style>