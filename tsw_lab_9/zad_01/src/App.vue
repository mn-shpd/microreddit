<template>
  <div id="content">
    <ul>
      <post v-for="(post, index) in posts" :key="post" :id="index" :content="post" @deleteEvent="deletePost"></post>
    </ul>
    <div id="form">
      <label for="postcontent">Post:</label><br>
      <input type="text" v-model="newPost" id="postcontent" name="postcontent"><br>
      <button @click="addNewPost">Add</button>
    </div>
  </div>
</template>

<script>
import Post from './components/Post.vue'

export default {
  name: 'App',
  components: {
    Post
  },
  data () {
    return {
      posts: ["Pierwszy post", "Drugi post", "Trzeci post"],
      newPost: ""
    }
  },
  methods: {
    deletePost(id) {
      this.posts.splice(id, 1);
    },
    addNewPost() {
      if(this.newPost.length !== 0) {
        this.posts.push(this.newPost);
      }
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

  #postcontent {
    width: 60%;
  }
</style>
