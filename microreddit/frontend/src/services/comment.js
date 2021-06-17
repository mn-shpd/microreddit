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
    }

    // getUserVote(postId) {
    //     return axios.get(`${url}/postvote/${postId}`, { withCredentials: true });
    // },

    // vote(vote, postId) {
    //     return axios.post(`${url}/postvote/${postId}`, { vote }, { withCredentials: true });
    // },

    // changeVote(vote, postId) {
    //     return axios.put(`${url}/postvote/${postId}`, { vote }, { withCredentials: true });
    // },
    
    // deleteVote(postId) {
    //     return axios.delete(`${url}/postvote/${postId}`, { withCredentials: true });
    // }
};