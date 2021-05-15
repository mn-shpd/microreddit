<template>
  <div id="content">
    <h1>ALL TASKS</h1>
    <div id="searchbar">
        <label for="searchinput">Search:</label>
        <input type="text" v-model="searchInput" id="searchinput" name="searchinput">
        <button @click="searchTasks">Find</button>
    </div>
    <ul v-if="doneFlag">
      <task v-for="task in doneTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @reloadEvent="loadTasks"></task>
    </ul>
    <ul v-else>
      <task v-for="task in tasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @reloadEvent="loadTasks"></task>
    </ul>
    <div id="listfilters">
        <button @click="sortTasks">Sort</button><br>
        <input type="checkbox" id="onlydone" value="onlydone" v-model="doneFlag">
        <label for="onlydone">Show/hide done</label>
    </div>
    <br>
    <router-link to="/">Return</router-link>
  </div>
</template>

<script>
import Task from './Task.vue'

export default {
  name: 'AllTasks',
  components: {
    Task,
  },
  data () {
    return {
      tasks: [],
      searchInput: "",
      sortFlag: false,
      doneFlag: false
    }
  },
  created: function () {
    this.loadTasks();
  },
  mounted: function() {
    this.$socketio.on("reloadTasks", () => {
      this.loadTasks();
    });
  },
  methods: {
    async searchTasks() {
      await this.loadTasks();
      if (this.searchInput.length !== 0) {
        let condition = new RegExp(this.searchInput);
        this.tasks = this.tasks.filter(function (el) {
          return condition.test(el.task);
        });
        if(this.sortFlag) {
          this.tasks.sort((a, b) => (a.task > b.task) ? 1 : -1);
        }
      }
    },
    sortTasks() {
      if(!this.sortFlag) {
        this.tasks.sort((a, b) => (a.task > b.task) ? 1 : -1);
      } else {
        this.tasks.sort((a, b) => (a.id > b.id) ? 1 : -1);
      }
      this.sortFlag = !this.sortFlag;
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

  #searchbar {
      display: flex;
      justify-content: space-evenly;
      width: 300px;
  }

  ul {
    list-style-type: none;
    width: 550px;
    padding: 0;
  }

  #listfilters {
      display: flex;
      width: 200px;
      justify-content: space-evenly;
      align-items: center;
  }
</style>
