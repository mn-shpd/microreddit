import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state() {
        return {
            loggedIn: false,
            userId: 0,
            username: ""
        }
    },
    getters: {},
    mutations: {
        setUser(state, payload) {
            state.loggedIn = true;
            state.userId = payload.id;
            state.username = payload.username;
        },
        resetUser(state) {
            state.loggedIn = false;
            state.userId = 0;
            state.username = "";
        }
    },
    actions: {}
});

export default store;