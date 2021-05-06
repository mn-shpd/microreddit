<template>
    <div id="form">
        <label for="taskcontent">Task:</label><br>
        <input type="text" v-model="newTask" id="taskcontent" name="taskcontent"><br>
        <button @click="addNewTask">Add</button>
    </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    task: Object
  },
  data () {
    return {
      newTask: ""
    }
  },
  emits: {
    reloadEvent: () => {
      console.log("Weryfikacja eventu pomyślna!");
      return true;
    }
  },
  created: function () {
      if(this.task !== undefined) {
        console.log(this.task.id);
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
            this.$emit("reloadEvent");
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #form {
    display: flex;
    width: 25%;
    padding: 20px;
    justify-content: space-evenly;
    border: 2px solid black;
    background-color: aquamarine;
  }

  label {
    font-weight: bold;
    font-size: 20px;
  }

  #taskcontent {
    width: 60%;
  }

</style>
