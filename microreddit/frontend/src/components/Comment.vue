<template>
    <div id="comment-container">
        <div id="comment-author">{{author}}</div>
        <div id="comment-content">{{content}}</div>
    </div>
</template>

<script>

export default {
  name: "Comment",
  props: {
      author: String,
      content: String
  },
  data () {
      return {
      };
  }
};
</script>

<style scoped lang="scss">

    #comment-container {
        display: flex;
        flex-direction: column;
        background-color: rgb(238, 238, 238);
        box-shadow: 1px 1px 2px grey, -1px 0 2px grey;
        border-radius: 7px;
        padding: 5px 5px;

        #comment-author {
            font-size: 12px;
            font-weight: bold;
            color: red;
        }

        #comment-content {
            font-size: 10px;
            overflow-wrap: break-word;
        }
    }

</style>