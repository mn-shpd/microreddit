<template>
  <div id="content">
    <ul>
      <task v-for="task in tasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @deleteEvent="deleteTask" @reloadTasks="loadTasks"></task>
    </ul>
    <div id="form">
      <label for="taskcontent">Task:</label><br>
      <input type="text" v-model="newTask" id="taskcontent" name="taskcontent"><br>
      <button @click="addNewTask">Add</button>
    </div>
  </div>
</template>

<script>
import Task from './components/Task.vue'

export default {
  name: 'App',
  components: {
    Task
  },
  data () {
    return {
      tasks: [],
      newTask: ""
    }
  },
  methods: {
    async deleteTask(id) {
      const axios = require("axios");
      await axios.delete("http://localhost:3000/tasks/" + id);
      this.loadTasks();
    },
    async addNewTask() {
      if(this.newTask.length !== 0) {
        const axios = require("axios");
        await axios.post("http://localhost:3000/tasks/", {
          task: this.newTask,
          done: false
        });
        this.loadTasks();
      }
    },
    async loadTasks() {
      const axios = require("axios");
      let temp_posts = await axios.get("http://localhost:3000/tasks/");
      this.tasks = temp_posts.data;
    }
  }
  // watch: {
  //   tasks: function () {
  //     this.loadTasks();
  //   }
  // }
}
</script>

<style>
  #content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  #form {
    display: flex;
    width: 25%;
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
    width: 60%;
  }
</style>
