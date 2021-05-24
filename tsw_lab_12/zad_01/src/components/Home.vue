<template>
  <div id="content">
    <h1>THREE RANDOM TASKS</h1>
    <h2 v-if="loggedIn">Welcome, {{username}}!</h2>
    <ul>
      <task v-for="task in randomUndoneTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" :loggedIn="loggedIn" :username="username" @reloadEvent="loadTasks"></task>
    </ul>
    <button type="button" v-if="loggedIn" @click="logOut">Logout</button>
    <button type="button" v-else @click="logIn">Login</button>
    <router-link :to="{ name: 'AllTasks', params: { username: username } }">All tasks</router-link>
    <router-link v-if="loggedIn" :to="{ name: 'AddTask', params: { username: username } }">Add a new task</router-link>
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
    if(this.$route.params.username) {
      this.loggedIn = true;
      this.username = this.$route.params.username;
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
    async logOut() {
      this.loggedIn = false;
      this.username = "";
      const axios = require("axios");
      await axios.get("http://localhost:3000/logout");
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