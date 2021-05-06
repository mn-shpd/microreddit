<template>
<li>
  <input type="checkbox" id="taskcheckbox" value="Done" :checked="done ? true : false" @click="checkTask">
  <div id="content"> {{ content }} </div>
  <button @click="editTask">Edytuj</button>
  <button @click="deleteTask">Usuń</button>
</li>
</template>

<script>
export default {
  name: 'Task',
  props: {
    id: Number,
    content: String,
    done: Boolean
  },
  emits: {
    deleteEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    },
    reloadEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    },
    editEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    }
  },
  methods: {
      async checkTask() {
        const axios = require("axios");
        await axios.put("http://localhost:3000/tasks/" + this.id, {
          task: this.content,
          done: this.done ? false : true
        });
        this.$emit("reloadEvent");
      },
      deleteTask() {
        console.log(this.id);
        this.$emit('deleteEvent', this.id);
      },
      editTask() {
        console.log(this.id);
        this.$emit('editEvent', {id: this.id, task: this.content, done: this.done});
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
    background-color: bisque;
    border: 2px solid black;
    margin: 5px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
}

#content {
  width: 75%;
}

</style>
