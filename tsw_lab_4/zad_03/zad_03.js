var fun1 = (results, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 1!`);
        results.push('Dane pobrane funkcja nr 1...');
        cb(results);
    }, 4000);
};

var fun2 = (results, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 2!`);
        results.push('Dane pobrane funkcja nr 2...');
        cb(results);
    }, 2000);
};

var fun3 = (results, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 3!`);
        results.push('Dane pobrane funkcja nr 3...');
        cb(results);
    }, 1000);
};

var fun4 = (results, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 4!`);
        results.push('Dane pobrane funkcja nr 4...');
        cb(results);
    }, 500);
};

const razemTab = (funTab, cb) => {
    var results = [];

    var checkResults = (results) => {
        if (results.length === funTab.length) {
            cb(results);
        }
    };

    funTab.forEach((element) => {
        element(results, checkResults);
    });
};

razemTab([fun1, fun2, fun3, fun4], (dane) => {
    dane.forEach((element) => {
        console.log(`Przetwarzam wyniki funkcji: ${element}`);
    });
});