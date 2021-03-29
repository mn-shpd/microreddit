const fun1 = async function() {
    return new Promise ((resolve) => {
            setTimeout(() => {
            console.log(`Pobieram dane funkcja nr 1!`);
            resolve('Dane pobrane funkcja nr 1...');
        }, 3000);
    });
};

const fun2 = async function() {
    return new Promise ((resolve) => {
            setTimeout(() => {
            console.log(`Pobieram dane funkcja nr 2!`);
            resolve('Dane pobrane funkcja nr 2...');
        }, 2000);
    });
};

const fun3 = async function() {
    return new Promise ((resolve) => {
            setTimeout(() => {
            console.log(`Pobieram dane funkcja nr 3!`);
            resolve('Dane pobrane funkcja nr 3...');
        }, 1000);
    });
};

const fun4 = async function() {
    return new Promise ((resolve) => {
            setTimeout(() => {
            console.log(`Pobieram dane funkcja nr 4!`);
            resolve('Dane pobrane funkcja nr 4...');
        }, 500);
    });
};

const razemTab = async function(funTab, cb) {

    let promesy = [];
    let results = [];


    funTab.forEach((element) => {
        promesy.push(element());
    });

    results = await Promise.all(promesy);

    cb(results);
};

razemTab([fun1, fun2, fun3, fun4], (dane) => {
    dane.forEach((element) => {
        console.log(`Przetwarzam wyniki funkcji: ${element}`);
    });
});