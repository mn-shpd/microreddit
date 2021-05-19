<template>
    <div id="all">
        <h1>Zarządzanie subreddit'ami</h1>
        <div id="subreddits" v-if="tabNumber===1">
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
        <SubredditEdit v-if="tabNumber===2" :subreddit="subredditToProcess" @cancel="cancel"></SubredditEdit>
        <SubredditModerators v-if="tabNumber===3" :subreddit="subredditToProcess" @goback="cancel"></SubredditModerators>
    </div>
</template>

<script>
import SubredditEdit from './SubredditEdit';
import SubredditModerators from './SubredditModerators';

export default {
  name: 'SubredditsManager',
  components: {
      SubredditEdit,
      SubredditModerators
  },
  data () {
      return {
          tabNumber: 1,
          mySubreddits: [],
          followedSubreddits: [],
          mySubredditsVis: true,
          followedSubredditsVis: false,
          subredditToProcess: {}
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
      changeTab(n) {
          this.tabNumber = n;
      },
      editSubreddit() {
          this.subredditToProcess = {
              name: "Testowy",
              desc: "Opisowy"
          };
          this.changeTab(2);
      },
      goToModerators() {
          this.subredditToProcess = {
              name: "Testowy",
              desc: "Opisowy"
          };
          this.changeTab(3);
      },
      cancel() {
          this.changeTab(1);
      }
  }
}
</script>

<style scoped lang="scss">

    #all {
        display: flex;
        flex-direction: column;
        align-items: center;
    
        h1 {
            margin-top: 30px;
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