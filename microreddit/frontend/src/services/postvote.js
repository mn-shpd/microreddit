import axios from "axios";

const url = "/api";
    
export default {

    getVotes(postId) {
        return axios.get(`${url}/postvote/total`, {
            params: {
                postId
            }
        });
    },

    getUserVote(postId) {
        return axios.get(`${url}/postvote/${postId}`, { withCredentials: true });
    },

    vote(vote, postId) {
        return axios.post(`${url}/postvote/${postId}`, { vote }, { withCredentials: true });
    },

    changeVote(vote, postId) {
        return axios.put(`${url}/postvote/${postId}`, { vote }, { withCredentials: true });
    },
    
    deleteVote(postId) {
        return axios.delete(`${url}/postvote/${postId}`, { withCredentials: true });
    }
};