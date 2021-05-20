import { createWebHistory, createRouter } from 'vue-router';
import Home from '../components/Home.vue';
import AllTasks from '../components/AllTasks';
import AddTask from '../components/AddTask';
import EditTask from '../components/EditTask';

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/list",
        name: "AllTasks",
        component: AllTasks
    },
    {
        path: "/new",
        name: "AddTask",
        component: AddTask
    },
    {
        path: "/edit",
        name: "EditTask",
        component: EditTask
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;