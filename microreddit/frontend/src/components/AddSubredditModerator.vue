<template>
    <form>
        <h2>Dodawanie moderatora do "{{subredditName}}"</h2>
        <div class="mb-3">
            <label for="input-username" class="form-label">Nazwa użytkownika</label>
            <input type="text" class="form-control" id="input-username" v-model="username">
        </div>
        <div id="buttons-section">
            <button type="submit" class="btn">Zatwierdź</button>
            <button type="button" class="btn" @click="cancelAdd">Anuluj</button>
        </div>
    </form>
</template>

<script>
export default {
  name: "AddSubredditModerator",
  data () {
      return {
          subredditId: 0,
          subredditName: "",
          username: ""
      };
  },
  created() {
      this.subredditId = this.$route.params.subredditId;
      this.subredditName = this.$route.params.subredditName;
  },
  methods: {
      cancelAdd() {
          this.$router.push({
              name: "SubredditModerators",
              params: {subredditId: this.subredditId, subredditName: this.subredditName}
          });
      }
  }
};
</script>

<style scoped lang="scss">

    form {
        h2 {
            margin: 20px 0;
        }

        display: flex;
        flex-direction: column;
        align-items: center;

        #input-username {
            width: 175px;
            display: flex;
            align-items: center;
        }

        #buttons-section {
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 10px;
            gap: 10px;

            button {
                background-color: bisque;
                border: 1px solid black;

                &:hover {
                    background-color: orange;
                }
            }
        }
    }
</style>