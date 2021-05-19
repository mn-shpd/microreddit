<template>
    <form>
        <h3>Edycja subreddit'a</h3>
        <div class="mb-3">
            <label for="input-subreddit-name" class="form-label">Nazwa</label>
            <input type="text" class="form-control" id="input-subreddit-name" v-model="subredditName">
        </div>
        <div class="mb-3">
            <label for="input-subreddit-desc" class="form-label">Opis</label>
            <input type="text" class="form-control" id="input-subreddit-desc" v-model="subredditDesc">
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
  props: {
      subreddit: Object
  },
  emits: {
      cancel: null
  },
  data () {
      return {
          subredditName: "",
          subredditDesc: ""
      }
  },
  created() {
      this.subredditName = this.subreddit.name;
      this.subredditDesc = this.subreddit.desc;
  },
  methods: {
      cancelEdit() {
          this.$emit("cancel");
      }
  }
}
</script>

<style scoped lang="scss">

    form {
        h3 {
            margin: 30px 0;
        }

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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