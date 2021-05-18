<template>
    <div id="all">
        <h1>Zarządzanie subreddit'ami</h1>
        <div id="buttons">
            <button type="button" class="btn" @click="showMySubreddits">Moje</button>
            <button type="button" class="btn" @click="showFollowedSubreddits">Obserwowane</button>
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
                                <button>Edytuj</button>
                                <button>Usuń</button>
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
      }
  }
}
</script>

<style scoped lang="scss">

    h1 {
        margin: 30px;
    }

    #buttons {
        margin: 20px;
        display: flex;
        justify-content: center;

        button {
            margin: 0 5px;
            background-color: bisque;
            
            &:hover {
                background-color: orange;
            }
        }
    }

    #subreddits-table {

        font-size: 12px;

        #action-buttons {
            
            button {
                width: 70px;
                line-height: 12px;
            }
        }
    }
</style>