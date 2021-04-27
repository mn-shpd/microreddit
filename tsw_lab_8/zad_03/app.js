const app = Vue.createApp({
    data() {
        return {
            result: 0,
            randomInt: 0,
            counter: 0
        }
    },
    created() {
        this.randomInt = Math.floor(Math.random() * 41) + 10;
        console.log("random: " + this.randomInt);
    },
    mounted() {
        window.setInterval(() => {
            this.counter += 1;
        }, 1000);
    },
    computed: {
        wynik() {
            if(this.result > this.randomInt) {
                return "Za dużo.";
            } else if(this.result < this.randomInt) {
                return "Jeszcze nie...";
            } else {
                return this.result;
            }
        }
    },
    methods: {
        add(n) {
            this.result += n;
            this.counter = 0;
            console.log("biezacy wynik: " + this.result);
        }
    },
    watch: {
        counter() {
            console.log("czas: " + this.counter);
            if(this.counter === 5) {
                this.counter = 0;
                this.result = 0;
            }
        }
    }
});

app.mount('#zadanie03')
