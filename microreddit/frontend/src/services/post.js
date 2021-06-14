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

    addPost(title, content, img, yturl) {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("img", img);
        formData.append("yturl", yturl);
        return axios.post(`${url}/post`, formData, { withCredentials: true });
    }
};

