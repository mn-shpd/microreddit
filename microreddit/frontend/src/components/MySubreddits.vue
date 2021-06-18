<template>
    <div id="all">
        <h2>Moje subreddit'y</h2>
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
import subredditService from "../services/subreddit";

export default {
  name: "MySubreddits",
  data () {
      return {
          subreddits: [],
          entireNumberOfSubsToLoad: 0,
          numberOfSubsToLoadAtOnce: 12,
          numberOfSubsAlreadyLoaded: 0,
          windowWidth: window.innerWidth,
          resizeId: 0,
          loadMoreVisibility: false,
          loadedMoreSubsFlag: false,
          numberOfLoads: 0,
          message: ""
      };
  },
  created() {
    this.init();
  },
  updated() {
    if(this.loadedMoreSubsFlag && this.numberOfLoads > 1) {
        this.scrollToBottom();
        this.loadedMoreSubsFlag = false;
    }
  },
  methods: {
      async init() {
          let response = await subredditService.getEntireNumberOfMySubreddits();
          if("message" in response.data) {
              this.message = response.data.message;
          }
          else if("amount" in response.data && response.data.amount > 0) {
              this.entireNumberOfSubsToLoad = response.data.amount;
              this.loadMoreVisibility = true;
              this.setNumberOfSubsToLoadAtOnce();
              this.loadNextSubreddits();
              window.onresize = this.onResize;
          }
          else {
              this.message = "Nie dodano jeszcze żadnych subreddit'ów.";
          }
      },
      onResize() {
          clearTimeout(this.resizeId);
          this.resizeId = setTimeout(this.onResizeEnd, 250);
      },
      onResizeEnd() {
          this.windowWidth = window.innerWidth;
          this.setNumberOfSubsToLoadAtOnce();
      },
      setNumberOfSubsToLoadAtOnce() {
          if(this.windowWidth >= 1200) {
              this.numberOfSubsToLoadAtOnce = 12;
          }
          else if(this.windowWidth >= 768) {
              this.numberOfSubsToLoadAtOnce = 9;
          }
          else if(this.windowWidth >= 576) {
              this.numberOfSubsToLoadAtOnce = 6;
          }
          else {
              this.numberOfSubsToLoadAtOnce = 3;
          }
      },
      async loadNextSubreddits() {
          let response = await subredditService.getNumberOfMySubreddits(this.numberOfSubsAlreadyLoaded, this.numberOfSubsToLoadAtOnce);
          if("message" in response.data) {
              this.message = response.data.message;
              this.loadMoreVisibility = false;
          }
          else {
              this.numberOfSubsAlreadyLoaded += response.data.length;
              this.subreddits = this.subreddits.concat(response.data);
              if(this.numberOfSubsAlreadyLoaded >= parseInt(this.entireNumberOfSubsToLoad)) {
                  this.loadMoreVisibility = false;
              }
              this.numberOfLoads++;
              this.loadedMoreSubsFlag = true;
          }
      },
      scrollToBottom() {
          let bottom = this.$refs.bottom;
          bottom.scrollIntoView();
      },
      goToSubreddit(name) {
          this.$router.push("/subreddit/" + name);
      }
  }
};
</script>

<style scoped lang="scss">

    #all {
        padding: 0 30px;
    
        h2 {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }

        #message {
            display: flex;
            justify-content: center;
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