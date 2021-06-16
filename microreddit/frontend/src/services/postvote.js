import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    getVotes(postId) {
        return axios.get(`${url}/postvote/total`, {
            params: {
                postId
            }
        }, { withCredentials: true });
    },

    getUserVote(postId) {
        return axios.get(`${url}/postvote`, {
            params: {
                postId
            },
            withCredentials: true
        });
    },

    vote(vote, postId) {
        return axios.post(`${url}/postvote`, { vote, postId }, { withCredentials: true });
    },

    changeVote(vote, postId) {
        return axios.put(`${url}/postvote`, { vote, postId }, { withCredentials: true });
    },
    
    deleteVote(postId) {
        console.log(postId);
        return axios.delete(`${url}/postvote`, { withCredentials: true });
    }
};