export default {
    methods: {
        getVideoId(url) {
            const pattern = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
            return url.match(pattern)[1];
        }
    }
};