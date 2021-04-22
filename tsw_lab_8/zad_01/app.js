const app = Vue.createApp({
    data() {
        return {
            name: "Wojciech",
            surname: "Rosiński",
            age: "",
            futureYear: "",
            imgUrl: "https://img.pngio.com/small-rocket-png-vectors-psd-and-clipart-for-free-download-small-rocket-with-man-png-260_265.png"
        }
    },
    computed: {
        fullName() {
            return this.name + " " + this.surname;
        },
        wrapAge() {
            const intAge = parseInt(this.age);
            if(intAge > 0) {
                return "Mam " + this.ageSpelling(this.age);
            }
            else if (intAge <= 0) {
                return "Wiek musi być większy od 0!";
            }
        },
        futureAge() {
            const currentYear = new Date().getFullYear();
            if (this.futureYear === "") {
                return "Nie podano roku w przyszłości!";
            } else if(this.age !== "" && this.futureYear > currentYear) {
                return "W roku " + this.futureYear + " będę miał/miała " + this.ageSpelling((parseInt(this.age) + (this.futureYear - currentYear)).toString());
            } else {
                return "To nie jest rok z przyszłości!";
            }
        },
        favouriteNumber() {
            return Math.floor(Math.random() * 100 + 1);
        }
    },
    methods: {
        ageSpelling(age) {
            const lastDigit = age[age.length - 1]
            const result = age + " ";
            if(age === "1") {
                return result + "rok.";
            }
            else if(isNaN(lastDigit) === false) {
                switch(lastDigit) {
                    case "2":
                        return result + "lata.";
                    case "3":
                        return result + "lata.";
                    case "4":
                        return result + "lata.";
                    default:
                        return result + "lat.";
                };
            }
        }
    }
});

app.mount('#zadanie01')
