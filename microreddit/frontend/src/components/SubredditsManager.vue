<template>
    <div id="all">
        <h2>Zarządzanie subreddit'ami</h2>
        <div id="buttons">
            <button class="btn" type="button" @click="showMySubreddits">Moje</button>
            <button class="btn" type="button" @click="showFollowedSubreddits">Obserwowane</button>
        </div>
        <div id="subreddits-table">
            <table id="my-subreddits" class="table" v-if="mySubredditsVis">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nazwa</th>
                        <th scope="col">Opis</th>
                        <th scope="col">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>TestowNazwa</td>
                        <td>TestowyOpis</td>
                        <td>
                            <div id="action-buttons">
                                <button @click="editSubreddit"><img src="../assets/edit.png" alt="Edytuj"></button>
                                <button @click="goToModerators"><img src="../assets/person.png" alt="Moderatorzy"></button>
                                <button><img src="../assets/trash.png" alt="Usuń"></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table id="followed-subreddits" class="table" v-if="followedSubredditsVis">
            </table>
        </div>
    </div>
</template>

<script>

export default {
  name: 'SubredditsManager',
  data () {
      return {
          mySubreddits: [],
          followedSubreddits: [],
          mySubredditsVis: true,
          followedSubredditsVis: false
      }
  },
  methods: {
      showMySubreddits() {
          this.mySubredditsVis = true;
          this.followedSubredditsVis = false;
      },
      showFollowedSubreddits() {
          this.mySubredditsVis = false;
          this.followedSubredditsVis = true;
      },
      editSubreddit() {
          this.$router.push({
              name: "SubredditEdit",
              params: {id: 1, name: "testowy", desc: "opisowy"}
          });
      },
      goToModerators() {
          this.$router.push({
              name: "SubredditModerators",
              params: {subredditId: 1, subredditName: "Testowy"}
          });
      }
  }
}
</script>

<style scoped lang="scss">

    #all {
        display: flex;
        flex-direction: column;
        align-items: center;
    
        h2 {
            margin-top: 20px;
        }

        #buttons {
            margin: 20px;
            display: flex;
            justify-content: center;

            button {
                margin: 0 5px;
                background-color: bisque;
                border: 1px solid black;
                
                &:hover {
                    background-color: orange;
                }
            }
        }

        #subreddits-table {

            font-size: 12px;

            #action-buttons {
                
                button {
                    line-height: 12px;
                    margin: 0 1px;
                    background-color: bisque;
                    
                    img {
                        width: 16px;
                        height: 16px;
                    }
                
                    &:hover {
                        background-color: orange;
                    }
                }
            }
        }
    }
</style>