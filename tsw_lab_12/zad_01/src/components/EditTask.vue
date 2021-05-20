<template>
    <div id="content">
        <h1>EDITING THE TASK</h1>
        <div id="form">
            <label for="taskcontent">Task:</label><br>
            <input type="text" v-model="taskToEdit" id="taskcontent" name="taskcontent"><br>
            <div id="buttons">
                <button @click="editTask">Edit</button>
                <button @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'EditTask',
  data () {
    return {
        id: 0,
        taskToEdit: "",
        taskDone: false
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.taskToEdit = this.$route.params.task;
    this.taskDone = this.$route.params.done;
  },
  methods: {
    async editTask() {
      const axios = require("axios");
      await axios.put("http://localhost:3000/tasks/" + this.id, {
          task: this.taskToEdit,
          done: this.taskDone
      });
      this.$socketio.emit("changeInTasks");
      this.$router.go(-1);
    },
    cancel() {
      this.$router.go(-1);
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
