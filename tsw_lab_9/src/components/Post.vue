<template>
<li>{{ content }} <button @click="deletePost">Usuń</button></li>

</template>

<script>
export default {
  name: 'Post',
  props: {
    id: Number,
    content: String
  },
  emits: {
    deleteEvent: () => {
        console.log("Weryfikacja eventu pomyślna!");
        return true;
    }
  },
  methods: {
      deletePost() {
          this.$emit('deleteEvent', this.id);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
    background-color: bisque;
    border: 2px solid black;
    margin: 5px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    width: 50%;
}

</style>
