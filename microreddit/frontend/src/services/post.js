import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    getEntireNumberOfSubredditPosts(subredditName) {
        return axios.get(`${url}/post/total`, {
            params: {
                subredditName
            }
        });
    },

    getNumberOfSubredditPosts(subredditName, offset, rows) {
        return axios.get(`${url}/post/${offset}/${rows}`, {
            params: {
                subredditName
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
        return axios.get(`${url}/post/search/${offset}/${rows}`, {
            params: {
                searchString
            }
        });
    },

    addPostWithImg(title, content, img, yturl, subredditId) {
        let formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("img", img);
        formData.append("yturl", yturl);
        formData.append("subredditId", subredditId);
        return axios.post(`${url}/post/img`, formData, { withCredentials: true });
    },

    addPost(title, content, yturl, subredditId) {
        return axios.post(`${url}/post`, {
            title,
            content,
            yturl,
            subredditId
        }, { withCredentials: true });
    },

    getPost(id) {
        return axios.get(`${url}/post/${id}`);
    },

    deletePost(id) {
        return axios.delete(`${url}/post/${id}`, { withCredentials: true });
    }
};

