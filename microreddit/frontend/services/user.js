import axios from "axios";

const url = "http://localhost:3000";
    
export default {
    
    login(email, password) {
        return axios.post(`${url}/user/login`, {
            email,
            password
        }, { withCredentials: true });
    },

    logout() {
        return axios.get(`${url}/user/logout`, { withCredentials: true });
    }
};

