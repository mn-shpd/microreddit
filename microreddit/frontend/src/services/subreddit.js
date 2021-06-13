import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    getEntireNumberOfSubreddits() {
        return axios.get(`${url}/subreddit/amount`);
    },

    getEntireNumberOfMySubreddits() {
        return axios.get(`${url}/subreddit/my/amount`, { withCredentials: true });
    },

    getEntireNumberOfFollowedSubreddits() {
        return axios.get(`${url}/subreddit/followed/amount`, { withCredentials: true });
    },

    getSubreddits() {
        return axios.get(`${url}/subreddit`);
    },

    getNumberOfSubreddits(offset, rows) {
        return axios.get(`${url}/subreddit/${offset}/${rows}`);
    },

    getNumberOfMySubreddits(offset, rows) {
        return axios.get(`${url}/subreddit/my/${offset}/${rows}`, { withCredentials: true });
    },

    getNumberOfFollowedSubreddits(offset, rows) {
        return axios.get(`${url}/subreddit/followed/${offset}/${rows}`, { withCredentials: true });
    },

    getSubredditByName(name) {
        return axios.get(`${url}/subreddit/byname`, {
            params: {
              name
            }
        });
    }
};

