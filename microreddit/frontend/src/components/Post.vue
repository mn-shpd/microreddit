<template>
    <div id="all" class="d-flex flex-column">
        <div id="post-container">
            <h5 id="title">{{title}}</h5>
            <div id="content" v-if="content.length !== 0">{{content}}</div>
            <div id="image-container">
                <img id="image" v-if="imgSrc.length !== 0" :src="imgSrc"/>
            </div>
            <div id="video-section">
                <div id="video-container">
                    <iframe src="https://www.youtube.com/embed/klZNNUz4wPQ" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        <div id="comments">
            <div id="comment"></div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Subreddit',
  data () {
      return {
          title: "Poscik",
          content: "",
          imgSrc: "",
          videoSrc: "",
          posts: []
      }
  },
  created() {
      //Tu zapytanie do bazy zwracajace post po ID.
      this.name = "test";
      this.content = "testowo lolloloodasdsdasdasdas sadasdasdas",
      this.date = "21.04.2021 21:30"
      this.imgSrc = "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80";
      this.videoSrc = "dQw4w9WgXcQ"
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

    #post-container {
        display: flex;
        flex-direction: column;
        width: 75%;
        margin: 50px auto;
        border: 3px solid black;
        background-color: rgb(241, 223, 147);
    }

    #title {
        display: flex;
        justify-content: center;
        margin: 30px;
    }

    #content {
        display: flex;
        justify-content: center;
        margin: 0 auto;
        max-width: 70%;
        padding: 10px;
        word-wrap: break-word;
        border: 3px dotted black;
    }

    #image-container {
        display: flex;
        justify-content: center;
        margin: 20px 0;

        #image {
            max-width: 70%;
            height: auto;
            border: 3px solid black;
        }
    }

    #video-section {
        margin: auto;
        width: 70%;
        margin-bottom: 30px;
    
        #video-container {
            position: relative;
            padding-bottom: 56.25%;
            padding-top: 30px;
            overflow: hidden;
            border: 3px solid black;

            iframe, object, embed {
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
            }
        }
    }
    
</style>