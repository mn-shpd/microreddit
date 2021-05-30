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
                        <router-link id="router-link" to="/followedsubrredits" class="btn nav-item" type="button">Dodaj post</router-link>
                    </div>
                    <div id="sort-section">
                        <h4>Sortowanie</h4>
                        <div id="sort-buttons">
                            <button class="btn nav-item" type="button">Popularne posty</button>
                            <button class="btn nav-item" type="button">Nowe posty</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <h2>Posty w ramach subreddit'a "{{name}}"</h2>
        <div id="cards" class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-4">
            <div class="col">
                <div id="card" class="card h-100" @click="goToPost(1)">
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
  name: 'Subreddit',
  data () {
      return {
          name: "",
          posts: []
      }
  },
  created() {
      //Tu zapytanie do bazy zwracajace subreddita po ID.
      this.name = "Test";
  },
  methods: {
      goToPost(id) {
          this.$router.push("/post/" + id);
      }
  }
}
</script>

<style scoped lang="scss">
    
    h2 {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

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
                gap: 20px;

                #action-section {
                    h4 {
                        display: flex;
                        justify-content: center;
                        margin: 10px 0;
                    }

                    #router-link {
                        background-color: bisque;
                        border: 1px solid black;
                        margin-bottom: 5px;
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
                        margin: 10px 0;
                    }

                    #sort-buttons {
                        display: flex;
                        gap: 10px;

                        button {
                            background-color: bisque;
                            border: 1px solid black;
                            margin-bottom: 5px;
                            width: 150px;

                            &:hover {
                                background-color: orange;
                            }
                        }
                    }
                }
            }
        }
    }

    #cards {
        margin: 0 20px;

        #card {
            background-color: rgb(247, 243, 211);

            &:hover {
                background-color: rgb(247, 238, 173);
            }
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