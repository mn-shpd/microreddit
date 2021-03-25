const fun1 = async function() {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 1!`);
        return 'Dane pobrane funkcja nr 1...';
    }, 4000);
};

const fun2 = async function() {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 2!`);
        return 'Dane pobrane funkcja nr 2...';
    }, 2000);
};

const fun3 = async function() {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 3!`);
        return 'Dane pobrane funkcja nr 3...';
    }, 1000);
};

const fun4 = async function() {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 4!`);
        return 'Dane pobrane funkcja nr 4...';
    }, 500);
};

const razemTab = async function(funTab, cb) {

    const results = Promise.all(funTab);
    cb(await results);
};

razemTab([fun1, fun2, fun3, fun4], (dane) => {
    dane.forEach((element) => {
        console.log(`Przetwarzam wyniki funkcji: ${element}`);
    });
});