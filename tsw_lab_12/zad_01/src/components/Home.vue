<template>
  <div id="content">
    <h1>THREE RANDOM TASKS</h1>
    <h2 v-if="loggedIn">Welcome, {{username}}!</h2>
    <ul>
      <task v-for="task in randomUndoneTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" :loggedIn="loggedIn" @reloadEvent="loadTasks"></task>
    </ul>
    <button type="button" v-if="loggedIn" @click="logOut">Logout</button>
    <button type="button" v-else @click="logIn">Login</button>
    <router-link to="/list">All tasks</router-link>
    <router-link v-if="loggedIn" to="/new">Add a new task</router-link>
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
      loggedIn: false,
      username: ""
    }
  },
  created: function () {
    this.loadTasks();
    this.loggedIn = localStorage.loggedIn === "true" ? true : false;
    if(this.loggedIn) {
      this.username = localStorage.username;
    }
  },
  mounted: function() {
    this.$socketio.on("reloadTasks", () => {
      this.loadTasks();
    });
  },
  methods: {
    async loadTasks() {
      const axios = require("axios");
      let temp_tasks = await axios.get("http://localhost:3000/tasks/");
      this.tasks = temp_tasks.data;
      this.tasks.sort((a, b) => (a.id > b.id) ? 1 : -1);
    },
    logIn() {
      this.$router.push("/login");
    },
    logOut() {
      localStorage.loggedIn = false;
      localStorage.username = "";
      this.loggedIn = false;
      this.username = "";
    }
  },
  computed: {
    randomUndoneTasks: function() {
      let undonetasks = this.tasks.filter(el => el.done === false);

      if(undonetasks.length > 3) {
        while(undonetasks.length !== 3) {
          undonetasks.splice(Math.floor(Math.random() * undonetasks.length), 1);
        }
      }

      return undonetasks;
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