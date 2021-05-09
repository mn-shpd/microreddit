<template>
    <div id="form">
        <label for="taskcontent">Task:</label><br>
        <input type="text" v-model="newTask" id="taskcontent" name="taskcontent"><br>
        <button v-if="editing" @click="editTask">Edit</button>
        <button v-if="editing" @click="cancelEdit">Cancel</button>
        <button v-else @click="addNewTask">Add</button>
    </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    task: Object
  },
  data () {
    return {
      newTask: "",
      editing: false
    }
  },
  emits: {
    reloadEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    },
    updatedEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    }
  },
  created: function () {
      if(this.task !== undefined) {
        this.newTask = this.task.task;
        this.editing = true;
      }
  },
  methods: {
    async addNewTask() {
      if(this.newTask.length !== 0) {
        const axios = require("axios");
        await axios.post("http://localhost:3000/tasks/", {
            task: this.newTask,
            done: false
        });
        this.$emit("reloadEvent");
        this.newTask = "";
      }
    },
    async editTask() {
      const axios = require("axios");
      await axios.put("http://localhost:3000/tasks/" + this.task.id, {
          task: this.newTask,
          done: this.task.done
      });
      this.$emit("updatedEvent");
      this.editing = false;
    },
    cancelEdit() {
      this.editing = false;
      this.$emit("updatedEvent");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #form {
    display: flex;
    width: 30%;
    padding: 20px;
    justify-content: space-evenly;
    border: 2px solid black;
    background-color: aquamarine;
  }

  label {
    font-weight: bold;
    font-size: 20px;
  }

  #taskcontent {
    width: 50%;
  }

</style>
