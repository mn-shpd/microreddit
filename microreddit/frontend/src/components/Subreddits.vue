<template>
    <div id="all">
        <h2>Wszystkie subreddit'y</h2>
        <div id="message">{{message}}</div>
        <div id="cards" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
            <div class="col" v-for="subreddit in subreddits" :key="subreddit.id">
                <div id="card" class="card h-100" @click="goToSubreddit(subreddit.name)">
                    <div class="card-body">
                        <h5 class="card-title">{{subreddit.name}}</h5>
                        <p class="card-text">{{subreddit.description}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="button-container">
            <button v-if="loadMoreVisibility" id="loadMoreButton" class="btn" type="button" @click="loadNextSubreddits">Załaduj więcej</button>
        </div>
        <div ref="bottom" id="bottom"></div>
    </div>
</template>

<script>
import subredditService from '../services/subreddit';

export default {
  name: 'AllSubreddits',
  data () {
      return {
          subreddits: [],
          windowWidth: window.innerWidth,
          numberOfSubsToLoadAtOnce: 12,
          numberOfSubsAlreadyLoaded: 0,
          loadMoreVisibility: true,
          message: ""
      }
  },
  created() {
    this.setNumberOfSubredditsToLoad();
    this.loadNextSubreddits();
    window.onresize = this.setLoadingOptions;
  },
  updated() {
    if(this.numberOfSubsAlreadyLoaded > this.numberOfSubsToLoadAtOnce) {
        this.scrollToBottom();
    }
  },
  methods: {
      setLoadingOptions() {
          this.windowWidth = window.innerWidth;
          this.setNumberOfSubredditsToLoad();
      },
      setNumberOfSubredditsToLoad() {
          if(this.windowWidth >= 1200) {
              this.numberOfSubsToLoadAtOnce = 12;
          }
          else if(this.windowWidth >= 768) {
              this.numberOfSubsToLoadAtOnce = 9;
          }
          else if(this.windowWidth >= 576) {
              this.numberOfSubsToLoadAtOnce = 6;
          }
      },
      async loadNextSubreddits() {
          let response = await subredditService.getNumberOfSubreddits(this.numberOfSubsAlreadyLoaded, this.numberOfSubsToLoadAtOnce);
          if("message" in response.data) {
              this.message = response.data.message;
              this.loadMoreVisibility = false;
          }
          else if(response.data.length === 0 && this.numberOfSubsAlreadyLoaded === 0) {
              this.message = "Nie dodano jeszcze żadnych subreddit'ów."
              this.loadMoreVisibility = false;
          }
          else {
              this.numberOfSubsAlreadyLoaded += this.numberOfSubsToLoadAtOnce;
              this.subreddits = this.subreddits.concat(response.data);
              if(response.data.length < this.numberOfSubsToLoadAtOnce) {
                  this.loadMoreVisibility = false;
              }
          }
      },
      scrollToBottom() {
          let cards = this.$refs.bottom;
          cards.scrollIntoView();
      },
      goToSubreddit(name) {
          this.$router.push("/subreddit/" + name);
      }
  }
}
</script>

<style scoped lang="scss">

    #all {
        padding: 0 30px;
    
        h2 {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }

        #cards {

            #card {
                width: 100%;
                background-color: rgb(247, 243, 211);
                
                &:hover {
                    background-color: rgb(247, 238, 173);
                    cursor: pointer;
                }
            }
        }

        #button-container {
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
</style>