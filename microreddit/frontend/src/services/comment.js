import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    getEntireNumberOfComments(postId) {
        return axios.get(`${url}/comment/total`, {
            params: {
                postId
            }
        });
    },

    getNumberOfComments(postId, offset, rows) {
        return axios.get(`${url}/comment`, {
            params: {
                postId,
                offset,
                rows
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