<template>
    <div id="all" class="d-xl-flex flex-xl-row">
        <nav id="navbar" class="navbar">
            <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-content" aria-controls="navbar-content" aria-expanded="true" aria-label="Toggle navigation">
                Menu
            </button>
            <div class="collapse mt-xl-0" id="navbar-content">
                <h4>Kategoria</h4>
                <div id="navbar-items" class="navbar-nav">
                    <router-link id="router-link" to="/usersettings" class="btn nav-item" type="button">Ustawienia konta</router-link>
                    <router-link id="router-link" to="/subredditsmanager" class="btn nav-item" type="button">Zarządzanie subreddit'ami</router-link>
                </div>
            </div>
        </nav>
        <div id="tab">
            <h1>Panel użytkownika</h1>
            <router-view/>
        </div>
    </div>
</template>

<script>

export default {
  name: "UserPanel",
  data () {
      return {
      };
  },
  methods: {
  }
};
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

            h4 {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
        }
    }

    #tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        h1 {
            margin-top: 40px;
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
// na desktopie wyswietla navbar od razu. 
// na mobilnych po kliknieciu przycisku.
@media (min-width: 1200px) {
    #navbar-content {
        display: block;
    }
}

</style>
