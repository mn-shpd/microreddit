export default {
    methods: {
        getVideoId(url) {
            const pattern = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
            return url.match(pattern)[1];
        },
        checkYtUrl(url) {
            const pattern = /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/;
            return pattern.test(url);
        }
    }
};