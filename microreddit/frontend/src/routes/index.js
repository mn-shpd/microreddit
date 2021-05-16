import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Register from '../components/Register';

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;