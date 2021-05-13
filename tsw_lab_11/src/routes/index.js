import { createWebHistory, createRouter } from 'vue-router';
import AllTasks from '../components/AllTasks';
import NewTask from '../components/NewTask';

const routes = [
    {
        path: "/list",
        name: "AllTasks",
        component: AllTasks
    },
    {
        path: "/new",
        name: "NewTask",
        component: NewTask
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;