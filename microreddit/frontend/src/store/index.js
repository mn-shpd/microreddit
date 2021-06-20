import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state() {
        return {
            loggedIn: false,
            userId: 0,
            username: "",
            userSubreddits: []
        };
    },
    getters: {},
    mutations: {
        setUser(state, payload) {
            state.loggedIn = true;
            state.userId = payload.id;
            state.username = payload.username;
            state.userSubreddits = payload.userSubreddits;
        },
        resetUser(state) {
            state.loggedIn = false;
            state.userId = 0;
            state.username = "";
        },
        changeUsername(state, username) {
            state.username = username;
        },
        addUserSubreddit(state, subreddit) {
            state.userSubreddits.push(subreddit);
        }
    },
    actions: {}
});

export default store;