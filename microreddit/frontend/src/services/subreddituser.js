import axios from "axios";

const url = "/api";
    
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