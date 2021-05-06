<template>
  <div id="content">
    <ul>
      <task v-for="task in tasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @editEvent="editTask" @deleteEvent="deleteTask" @reloadEvent="loadTasks"></task>
    </ul>
    <Form v-if="editing" :task="taskToEdit" @reloadEvent="loadTasks"></Form>
    <Form v-else @reloadEvent="loadTasks"></Form>
  </div>
</template>

<script>
import Task from './components/Task.vue'
import Form from './components/Form.vue'

export default {
  name: 'App',
  components: {
    Task,
    Form
  },
  data () {
    return {
      tasks: [],
      newTask: "",
      taskToEdit: {},
      editing: false
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
    async deleteTask(id) {
      const axios = require("axios");
      await axios.delete("http://localhost:3000/tasks/" + id);
      this.loadTasks();
    },
    async loadTasks() {
      const axios = require("axios");
      let temp_posts = await axios.get("http://localhost:3000/tasks/");
      this.tasks = temp_posts.data;
      this.tasks.sort((a, b) => (a.id > b.id) ? 1 : -1);
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
    width: 50%;
  }

</style>
