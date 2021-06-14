import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login';
import Register from '../components/Register';
import UserPanel from '../components/UserPanel';
import UserSettings from '../components/UserSettings';
import SubredditsManager from '../components/SubredditsManager';
import SubredditEdit from '../components/SubredditEdit';
import SubredditModerators from '../components/SubredditModerators';
import AddSubredditModerator from '../components/AddSubredditModerator';
import Home from '../components/Home';
import Subreddits from '../components/Subreddits';
import MySubreddits from '../components/MySubreddits';
import FollowedSubreddits from '../components/FollowedSubreddits';
import Subreddit from '../components/Subreddit';
import Post from '../components/Post';
import AddPost from '../components/AddPost';

const routes = [
    {
        path: "/",
        name: Home,
        component: Home,
        children: [
            {
                path: "/subreddits",
                name: Subreddits,
                component: Subreddits
            },
            {
                path: "/mysubreddits",
                name: MySubreddits,
                component: MySubreddits
            },
            {
                path: "/followedsubreddits",
                name: FollowedSubreddits,
                component: FollowedSubreddits
            }
        ]
    },
    {
        path: "/subreddit/:name",
        name: Subreddit,
        component: Subreddit
    },
    {
        path: "/post/:id",
        name: Post,
        component: Post
    },
    {
        path: "/addPost/:subredditid",
        name: AddPost,
        component: AddPost
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