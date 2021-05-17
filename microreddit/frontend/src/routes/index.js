import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Register from '../components/Register';
import UserPanel from '../components/UserPanel';

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
    },
    {
        path: "/userpanel",
        name: "UserPanel",
        component: UserPanel
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;