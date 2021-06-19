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
    },

    getSubredditById(id) {
        return axios.get(`${url}/subreddit/${id}`);
    },

    getSearchedSubredditsTotal(searchString) {
        return axios.get(`${url}/subreddit/search/total`, {
            params: {
                searchString
            }
        });
    },

    getNumberOfSearchedSubreddits(searchString, offset, rows) {
        return axios.get(`${url}/subreddit/search`, {
            params: {
                searchString,
                offset,
                rows
            }
        });
    },

    addSubreddit(name, description) {
        return axios.post(`${url}/subreddit`, {
            name,
            description
        }, { withCredentials: true });
    },

    updateSubreddit(id, desc) {
        return axios.put(`${url}/subreddit/${id}`, {
            description: desc
        }, { withCredentials: true });
    }
};

