
<template>
  <div id="content">
    <label for="searchinput">Search:</label>
    <input type="text" v-model="searchInput" id="searchinput" name="searchinput">
    <button @click="searchTasks">Find</button>
    <ul v-if="doneFlag">
      <task v-for="task in doneTasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @editEvent="editTask" @deleteEvent="deleteTask" @reloadEvent="loadTasks"></task>
    </ul>
    <ul v-else>
      <task v-for="task in tasks" :key="task" :id="task.id" :content="task.task" :done="task.done" @editEvent="editTask" @deleteEvent="deleteTask" @reloadEvent="loadTasks"></task>
    </ul>
    <button @click="sortTasks">Sort</button><br>
    <input type="checkbox" id="onlydone" value="onlydone" v-model="doneFlag">
    <label for="onlydone">Show/hide done</label>
    <Form v-if="editing" :task="taskToEdit" @reloadEvent="loadTasks" @updatedEvent="taskEdited"></Form>
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
      editing: false,
      searchInput: "",
      sortFlag: false,
      doneFlag: false
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
