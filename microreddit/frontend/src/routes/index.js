import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Register from '../components/Register';
import UserPanel from '../components/UserPanel';
import UserSettings from '../components/UserSettings';
import SubredditsManager from '../components/SubredditsManager';
import SubredditEdit from '../components/SubredditEdit';
import SubredditModerators from '../components/SubredditModerators';
import AddSubredditModerator from '../components/AddSubredditModerator';
import Subreddits from '../components/Subreddits';
import AllSubreddits from '../components/AllSubreddits';
import Subreddit from '../components/Subreddit';

const routes = [
    {
        path: "/",
        name: Subreddits,
        component: Subreddits,
        children: [
            {
                path: "/allsubreddits",
                name: AllSubreddits,
                component: AllSubreddits
            }
        ]
    },
    {
        path: "/subreddit/:id",
        name: Subreddit,
        component: Subreddit
    },
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
            },
            {
                path: "/addsubredditmoderator",
                name: "AddSubredditModerator",
                component: AddSubredditModerator
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;