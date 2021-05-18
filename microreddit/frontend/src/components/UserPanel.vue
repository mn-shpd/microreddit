<template>
    <div id="all" class="d-xl-flex flex-xl-row">
        <nav id="navbar" class="navbar">
            <button id="menu-button" class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="true" aria-label="Toggle navigation">
                Menu
            </button>
            <div class="collapse" id="navbarNav">
                <div id="navbar-items" class="navbar-nav">
                    <button class="btn nav-item" type="button" @click="changeTab(1)">Ustawienia konta</button>
                    <button class="btn nav-item" type="button" @click="changeTab(2)">Zarządzanie subreddit'ami</button>
                    <button class="btn nav-item" type="button" @click="changeTab(3)">Zarządzanie użytkownikami</button>
                </div>
            </div>
        </nav>
        <div id="tab">
            <UserSettings v-if="tabNumber===1"></UserSettings>
            <SubredditsManager v-if="tabNumber===2"></SubredditsManager>
        </div>
    </div>
</template>

<script>
import SubredditsManager from './SubredditsManager.vue';
import UserSettings from './UserSettings';

export default {
  name: 'UserPanel',
  components: {
      UserSettings,
      SubredditsManager
  },
  data () {
      return {
          tabNumber: 0
      }
  },
  methods: {
      changeTab(n) {
          this.tabNumber = n;
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
            width: 70px;
            display: flex;
            justify-content: center;
        }

        #navbar-items {
            margin-top: 10px;
        }
    }

    #tab {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    button {
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
    #navbarNav {
        display: block;
    }
}

</style>
