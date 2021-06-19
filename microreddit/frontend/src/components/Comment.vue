<template>
    <div id="comment-container">
        <div id="comment-header">
            <div id="comment-author">{{author}}</div>
            <img src="../assets/delete.png" alt="Usuń" v-if="isModerator" @click="deleteComment(id)">
        </div>
        <div id="comment-content">{{content}}</div>
    </div>
</template>

<script>
import commentService from "../services/comment";

export default {
  name: "Comment",
  props: {
      isModerator: Boolean,
      id: Number,
      author: String,
      content: String
  },
  emits: {
      onDelete: null
  },
  data () {
      return {
      };
  },
  methods: {
      async deleteComment(id) {
        let response = await commentService.deleteComment(id);
        if("message" in response.data) {
            this.$emit("onDelete", {success: false, message: response.data.message});
        }
        else {
            this.$emit("onDelete", {success: true});
        }
      }
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

        #comment-header {
            display: flex;
            justify-content: space-between;

            #comment-author {
                font-size: 12px;
                font-weight: bold;
                color: red;
            }

            img {
                width: 15px;
                height: 15px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        #comment-content {
            font-size: 10px;
            overflow-wrap: break-word;
        }
    }

</style>