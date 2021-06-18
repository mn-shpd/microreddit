import axios from "axios";

const url = "http://localhost:3000";
    
export default {

    checkIfUserFollows(subredditId) {
        return axios.get(`${url}/subreddituser`, {
            params: {
                subredditId
            },
            withCredentials: true
        });
    },

    follow(subredditId) {
        return axios.post(`${url}/subreddituser`, {
            subredditId
        }, { withCredentials: true });
    },

    unfollow(subredditId) {
        return axios.delete(`${url}/subreddituser`, {
            data: {
                subredditId
            },
            withCredentials: true
        });
    }
};