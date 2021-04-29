<template>
  <ul>
    <post v-for="(post, index) in posts" :key="post" :id="index" :content="post" @deleteEvent="deletePost"></post>
  </ul>
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
      posts: ["Pierwszy post", "Drugi post", "Trzeci post"]
    }
  },
  methods: {
    deletePost(id) {
      this.posts.splice(id, 1);
    }
  }
}
</script>

<style>
  ul {
    padding: 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
