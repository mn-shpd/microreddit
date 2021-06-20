<template>
    <div id="content-container" class="d-xl-flex flex-xl-row">
        <nav v-if="loggedIn" id="navbar">
            <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-content" aria-controls="navbar-content" aria-expanded="true" aria-label="Toggle navigation">
                Menu
            </button>
            <div class="collapse mt-xl-0" id="navbar-content">
                <div id="subreddit-menu">
                    <h4>Subreddit'y</h4>
                    <div id="navbar-items" class="navbar-nav">
                        <router-link id="router-link" to="/subreddits" class="btn nav-item" type="button">Wszystkie</router-link>
                        <router-link id="router-link" to="/mysubreddits" class="btn nav-item" type="button">Moje</router-link>
                        <router-link id="router-link" to="/followedsubreddits" class="btn nav-item" type="button">Obserwowane</router-link>
                    </div>
                </div>
                <div id="actions-menu">
                    <h4>Akcje</h4>
                    <div id="navbar-items" class="navbar-nav">
                        <router-link id="router-link" to="/addsubreddit" class="btn nav-item" type="button">Dodaj subreddit'a</router-link>
                    </div>
                </div>
            </div>
        </nav>
        <router-view/>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  data () {
      return {
      };
  },
  computed: mapState([
    "loggedIn"
  ]),
  created() {
      if(this.loggedIn) {
          this.$router.push("/userhome");
      }
      else {
          this.$router.push("/subreddits");
      }
  }
};
</script>

<style scoped lang="scss">

#content-container {

    #navbar {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        background-color: rgb(212, 214, 216);
        box-shadow: 4px 4px 8px grey, -2px 0 4px grey;

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
            }

            #actions-menu {
                margin-top: 10px;
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
}

// na desktopie wyswietla navbar od razu. 
// na mobilnych po kliknieciu przycisku.
@media (min-width: 1200px) {
    #navbar-content {
        display: block;
    }

    #navbar {
        min-height: 100vh;
    }
}
</style>