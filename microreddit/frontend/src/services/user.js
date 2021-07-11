import axios from "axios";

const url = "/api";
    
export default {
    
    login(email, password) {
        return axios.post(`${url}/user/login`, {
            email,
            password
        }, { withCredentials: true });
    },

    logout() {
        return axios.get(`${url}/user/logout`, { withCredentials: true });
    },

    register(email, username, password) {
        return axios.post(`${url}/user/register`, {
            email,
            username,
            password
        });
    },

    getUserData() {
        return axios.get(`${url}/user`, { withCredentials: true });
    },

    updateUserData(username, email, password) {
        return axios.put(`${url}/user`, {
            email,
            username,
            password
        }, { withCredentials: true });
    }
};

