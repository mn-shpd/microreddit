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
      this.$router.push("/list");
      this.$socketio.emit("changeInTasks");
      }
    },
    cancel() {
      this.$router.push("/");
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
