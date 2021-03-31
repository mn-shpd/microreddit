const axios = require("axios");

async function skrypt() {

    let i = 0;
    let posty_promesy = [];
    let kom_promesy = [];
    
    for(i = 0; i < 5; i++) {
        randomInt = Math.floor(Math.random() * (100 - 1) + 1);
        let post_promesa = axios.get("https://jsonplaceholder.typicode.com/posts/" + randomInt);
        posty_promesy.push(post_promesa);
        let kom_promesa = axios.get("https://jsonplaceholder.typicode.com/posts/" + randomInt + "/comments");
        kom_promesy.push(kom_promesa);
    };

    let posty_results = await Promise.all(posty_promesy);
    let kom_results = await Promise.all(kom_promesy);
    
    let kom_edytowane = kom_results.reduce((prev, curr) => {

        //Komentarze poj. posta.
        let komentarze = curr.data;

        //Edycja wszystkich komentarzy dla tego posta.
        let nowe_komentarze = komentarze.reduce((prev, curr) => {
            let temp = {
                name: curr.name,
                email: curr.email,
                body: curr.body
            };
            prev.push(temp);
            return prev;
        }, []);

        prev.push(nowe_komentarze);
        return prev;
    }, []);

    let wyniki = posty_results.reduce((prev, curr) => {
        let temp = {
            entry: {
                title: curr.data.title,
                body: curr.data.body
            },
            comments: kom_edytowane.shift()
        };
        prev.push(temp);
        return prev;
    }, []);

    return wyniki;
};

skrypt().then((results) => {
    console.log(results);
});
