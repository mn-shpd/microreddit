<template>
    <div id="all" class="d-xl-flex flex-xl-row">
        <nav id="navbar" class="navbar">
            <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-content" aria-controls="navbar-content" aria-expanded="true" aria-label="Toggle navigation">
                Menu
            </button>
            <div class="collapse mt-xl-0" id="navbar-content">
                <h4>Subreddit'y</h4>
                <div id="navbar-items" class="navbar-nav">
                    <router-link id="router-link" to="/subreddits" class="btn nav-item" type="button">Wszystkie</router-link>
                    <router-link id="router-link" to="/mysubreddits" class="btn nav-item" type="button">Moje</router-link>
                    <router-link id="router-link" to="/followedsubreddits" class="btn nav-item" type="button">Obserwowane</router-link>
                </div>
            </div>
        </nav>
        <div id="tab">
            <router-view/>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
      return {
      }
  },
  created() {
    // this.$router.push("/subreddits");
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

    #navbar {
        display: flex;
        flex-direction: column;
        padding: 30px;
        background-color: rgb(212, 214, 216);
        height: 100vh;

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

            h4 {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
        }
    }

    #router-link {
        background-color: bisque;
        border: 1px solid black;
        margin-bottom: 5px;
        width: 220px;

        &:hover {
            background-color: orange;
        }
    }

    #tab {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

// na desktopie wyswietla navbar od razu. 
// na mobilnych po kliknieciu przycisku.
@media (min-width: 1200px) {
    #navbar-content {
        display: block;
    }
}
</style>