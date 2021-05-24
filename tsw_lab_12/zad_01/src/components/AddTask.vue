<template>
    <div id="content">
      <h1>ADDING A NEW TASK</h1>
      <div id="form">
          <label for="taskcontent">Task:</label><br>
          <input type="text" v-model="newTask" id="taskcontent" name="taskcontent"><br>
          <div id="buttons">
            <button @click="addNewTask">Add</button>
            <button @click="cancel">Cancel</button>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'AddTask',
  data () {
    return {
      newTask: "",
      username: ""
    }
  },
  created: function () {
    if(this.$route.params.username) {
      this.username = this.$route.params.username;
    }
  },
  methods: {
    async addNewTask() {
      if(this.newTask.length !== 0) {
        const axios = require("axios");
        await axios.post("http://localhost:3000/tasks/", {
            task: this.newTask,
            done: false
        }, { withCredentials: true });
      this.$router.push({ name: 'AllTasks', params: { username: this.username } });
      this.$socketio.emit("changeInTasks");
      }
    },
    cancel() {
      this.$router.push({
        name: "Home",
        params: { username: this.username }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

   #content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
    }

    #form {
        display: flex;
        width: 450px;
        padding: 15px;
        align-items: center;
        justify-content: space-evenly;
        border: 2px solid black;
        background-color: aquamarine;
        line-height: 20px;
    }

    label {
        font-weight: bold;
        font-size: 20px;
    }

    #taskcontent {
        width: 50%;
    }

    #buttons {
        width: 25%;
        display: flex;
        justify-content: space-evenly;
    }

</style>
