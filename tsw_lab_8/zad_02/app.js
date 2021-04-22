const app = Vue.createApp({
    data() {
        return {
            showAlert: false,
            result1: "WYNIK 1",
            result2_temp: "",
            result2: "WYNIK 2"
        }
    },
    computed: {
    },
    methods: {
        changeAlertVisibility() {
            this.showAlert = !this.showAlert;
        },
        appendText(event) {
            this.result1 += event.target.value;
            event.target.value = "";
        },
        addText() {
            this.result2 = this.result2_temp;
            this.result2_temp = "";
        }
    }
});

app.mount('#zadanie02')
