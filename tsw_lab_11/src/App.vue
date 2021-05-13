<template>
  <div id="content">
    <ul>
      <task v-for="task in randomUndoneTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @editEvent="editTask" @deleteEvent="deleteTask" @reloadEvent="loadTasks"></task>
    </ul>
    <router-link to="/list">Wszystkie zadania</router-link>
    <router-link to="/new">Dodaj nowe zadanie</router-link>
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
      tasks: []
    }
  },
  created: function () {
    this.loadTasks();
  },
  methods: {
    editTask(task) {
      this.taskToEdit = task
      this.editing = true;
    },
    taskEdited() {
      this.taskToEdit = null;
      this.editing = false;
      this.loadTasks();
    },
    async deleteTask(id) {
      const axios = require("axios");
      await axios.delete("http://localhost:3000/tasks/" + id);
      this.loadTasks();
    },
    async loadTasks() {
      const axios = require("axios");
      let temp_tasks = await axios.get("http://localhost:3000/tasks/");
      this.tasks = temp_tasks.data;
      this.tasks.sort((a, b) => (a.id > b.id) ? 1 : -1);
    },
  },
  computed: {
    doneTasks: function() {
      return this.tasks.filter(el => el.done === true);
    },
    randomUndoneTasks: function() {
      let undonetasks = this.tasks.filter(el => el.done === false);
      let i = 0, randomInt = 0;
      let max = undonetasks.length;
      let result = [];
      for(i; i < 3; i++) {
        randomInt = Math.floor(Math.random() * (max + 1));
        result.push(undonetasks[randomInt]);
      }
      return result;
    }
  }
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
    width: 600px;
  }

</style>
