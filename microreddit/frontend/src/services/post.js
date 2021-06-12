import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    getEntireNumberOfSubredditPosts(name) {
        return axios.get(`${url}/post/amount`, {
            params: {
                name
            }
        });
    },

    getNumberOfSubredditPosts(name, offset, rows) {
        return axios.get(`${url}/post`, {
            params: {
                name,
                offset,
                rows
            }
        });
    }
};

