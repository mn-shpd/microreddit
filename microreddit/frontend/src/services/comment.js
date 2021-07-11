import axios from "axios";

const url = "/api";
    
export default {

    getEntireNumberOfComments(postId) {
        return axios.get(`${url}/comment/total`, {
            params: {
                postId
            }
        });
    },

    getNumberOfComments(postId, offset, rows) {
        return axios.get(`${url}/comment/${offset}/${rows}`, {
            params: {
                postId
            }
        });
    },

    addComment(postId, comment) {
        return axios.post(`${url}/comment`, {
            postId,
            comment
        }, { withCredentials: true });
    },

    deleteComment(commentId) {
        return axios.delete(`${url}/comment/${commentId}`, { withCredentials: true });
    }
};