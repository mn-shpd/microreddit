<template>
    <form>
        <h2>Edycja subreddit'a</h2>
        <div class="mb-3">
            <label for="input-subreddit-name" class="form-label">Nazwa</label>
            <input type="text" class="form-control" id="input-subreddit-name" v-model="name">
        </div>
        <div class="mb-3">
            <label for="input-subreddit-desc" class="form-label">Opis</label>
            <input type="text" class="form-control" id="input-subreddit-desc" v-model="desc">
        </div>
        <div id="buttons-section">
            <button type="submit" class="btn">Zatwierdź</button>
            <button type="button" class="btn" @click="cancelEdit">Anuluj</button>
        </div>
    </form>
</template>

<script>
export default {
  name: 'SubredditEdit',
  data () {
      return {
          id: 0,
          name: "",
          desc: ""
      }
  },
  created() {
      this.id = this.$route.params.id;
      this.name = this.$route.params.name;
      this.desc = this.$route.params.desc;
  },
  methods: {
      cancelEdit() {
          this.$router.go(-1);
      }
  }
}
</script>

<style scoped lang="scss">

    form {
        h2 {
            margin: 20px 0;
        }

        display: flex;
        flex-direction: column;

        #buttons-section {
            display: flex;
            width: 100%;
            justify-content: space-evenly;
            margin-top: 10px;

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