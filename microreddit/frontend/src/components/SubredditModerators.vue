<template>
    <div id="all">
        <h3>Moderatorzy "{{subreddit.name}}"</h3>
        <div id="moderators">
            <table id="moderators-table" class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Użytkownik</th>
                        <th scope="col">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>TestowyUżytkownik</td>
                        <td>
                            <div id="action-buttons">
                                <button><img src="../assets/trash.png" alt="Usuń"></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="buttons">
                <button class="btn" type="button">Dodaj</button>
                <button class="btn" type="button" @click="goBack">Wróć</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'SubredditModerators',
  props: {
      subreddit: Object
  },
  emits: {
      goback: null
  },
  data () {
      return {
      }
  },
  methods: {
      goBack() {
          this.$emit("goback");
      }
  }
}
</script>

<style scoped lang="scss">

    #all {
        display: flex;
        flex-direction: column;
        align-items: center;
    
        h3 {
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

        #moderators-table {

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