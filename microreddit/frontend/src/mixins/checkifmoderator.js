export default {
    methods: {
        checkIfUserIsModeratorById(id) {
            let userSubreddits = this.$store.state.userSubreddits;
            for(let i = 0; i < userSubreddits.length; i++) {
                if(userSubreddits[i].subreddit_id === id) {
                    return true;
                }
            }
            return false;
        },
        checkIfUserIsModeratorByName(name) {
            let userSubreddits = this.$store.state.userSubreddits;
            for(let i = 0; i < userSubreddits.length; i++) {
                if(userSubreddits[i].subreddit_name === name) {
                    return true;
                }
            }
            return false;
        }
    }
};

