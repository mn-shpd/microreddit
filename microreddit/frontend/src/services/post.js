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
    },

    getSearchedPostsTotal(searchString) {
        return axios.get(`${url}/post/search/total`, {
            params: {
                searchString
            }
        });
    },

    getNumberOfSearchedPosts(searchString, offset, rows) {
        return axios.get(`${url}/post/search`, {
            params: {
                searchString,
                offset,
                rows
            }
        });
    },

    addPost(title, content, img, yturl, subredditId) {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("img", img);
        formData.append("yturl", yturl);
        formData.append("subredditId", subredditId);
        return axios.post(`${url}/post`, formData, { withCredentials: true });
    },

    getPost(id) {
        return axios.get(`${url}/post/${id}`);
    },

    deletePost(id) {
        return axios.delete(`${url}/post/${id}`, { withCredentials: true });
    }
};

