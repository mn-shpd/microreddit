import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Register from '../components/Register';
import UserPanel from '../components/UserPanel';
import UserSettings from '../components/UserSettings';
import SubredditsManager from '../components/SubredditsManager';
import SubredditEdit from '../components/SubredditEdit';
import SubredditModerators from '../components/SubredditModerators';

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
        component: UserPanel,
        children: [
            {
                path: "/usersettings",
                name: "UserSettings",
                component: UserSettings
            },
            {
                path: "/subredditsmanager",
                name: "SubredditsManager",
                component: SubredditsManager
            },
            {
                path: "/subredditedit",
                name: "SubredditEdit",
                component: SubredditEdit
            },
            {
                path: "/subredditmoderators",
                name: "SubredditModerators",
                component: SubredditModerators
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;