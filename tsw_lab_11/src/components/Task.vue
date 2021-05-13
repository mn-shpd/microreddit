<template>
  <li>
    <input type="checkbox" id="taskcheckbox" value="Done" :checked="done ? true : false" @click="checkTask">
    <div id="taskcontent"> {{ content }} </div>
    <div id="buttons">
      <button @click="editTask">Edit</button>
      <button @click="deleteTask">Delete</button>
    </div>
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
    reloadEvent: () => {
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
      async deleteTask() {
        const axios = require("axios");
        await axios.delete("http://localhost:3000/tasks/" + this.id);
        this.$emit("reloadEvent");
      },
      editTask() {
        this.$router.push({
          name: "EditTask",
          params: {id: this.id, task: this.content, done: this.done}
        });
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

#taskcontent {
  width: 70%;
  display: flex;
  justify-content: left;
}

#buttons {
  width: 20%;
  display: flex;
  justify-content: space-evenly;
}
</style>
