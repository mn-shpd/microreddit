<template>
  <div id="content">
    <h1>THREE RANDOM TASKS</h1>
    <ul>
      <task v-for="task in randomTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @reloadEvent="loadTasks"></task>
    </ul>
    <router-link to="/list">All tasks</router-link>
    <router-link to="/new">Add a new task</router-link>
  </div>
</template>

<script>
import Task from './Task.vue'

export default {
  name: 'Home',
  components: {
    Task
  },
  data () {
    return {
      tasks: [],
      randomTasks: []
    }
  },
  created: function () {
    this.loadTasks();
    this.getRandomTasks();
  },
  methods: {
    async loadTasks() {
      const axios = require("axios");
      let temp_tasks = await axios.get("http://localhost:3000/tasks/");
      this.tasks = temp_tasks.data;
      this.tasks.sort((a, b) => (a.id > b.id) ? 1 : -1);
    },
    getRandomTasks() {
      let undonetasks = this.tasks.filter(el => el.done === false);
      console.log(undonetasks);
      let result = [];

      if(undonetasks.length > 3) {
        this.randomTasks = undonetasks;
      } else {
        while(result.length !== 3) {
          result.push(undonetasks.splice(Math.floor(Math.random() * undonetasks.length), 1));
        }
      }
      this.randomTasks = result;
    }
  }
}
</script>

<style scoped>
  #content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  ul {
    list-style-type: none;
    width: 550px;
    padding: 0;
  }
</style>