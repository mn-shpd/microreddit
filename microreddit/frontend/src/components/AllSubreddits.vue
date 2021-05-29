<template>
    <div id="all">
        <h2>Wszystkie subreddit'y</h2>
        <div class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-4">
            <div class="col">
                <div id="card" class="card h-100" @click="goToSubreddit(1)">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div id="card" class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum dolores lorem ipsum sum.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Subreddits',
  data () {
      return {
          subreddits: []
      }
  },
  methods: {
      goToSubreddit(id) {
          this.$router.push("/subreddit/" + id);
      }
  }
}
</script>

<style scoped lang="scss">

    #all {
        padding: 0 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    
        h2 {
            margin: 20px 0;
        }

        #card {
            background-color: rgb(247, 243, 211);
            
            &:hover {
                background-color: rgb(247, 238, 173);
                cursor: pointer;
            }
        }
    }
</style>