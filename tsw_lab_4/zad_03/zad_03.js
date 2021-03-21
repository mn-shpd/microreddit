var fun1 = (results) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 1!`);
        results.push('Dane pobrane funkcja nr 1...');
    }, 4000);
};

var fun2 = (results) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 2!`);
        results.push('Dane pobrane funkcja nr 2...');
    }, 2000);
};

var fun3 = (results) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 3!`);
        results.push('Dane pobrane funkcja nr 3...');
    }, 1000);
};

var fun4 = (results) => {
    setTimeout(() => {
        console.log(`Pobieram dane funkcja nr 4!`);
        results.push('Dane pobrane funkcja nr 4...');
    }, 500);
};

const razemTab = (funTab, cb) => {
    var results = [];

    var checkResults = (results) => {
        if (results.length !== funTab.length) {
            return false;
        } else {
            return true;
        }
    };

    funTab.forEach((element) => {
        element(results);
    });

    let interval = setInterval(() => { 
        if (checkResults(results)) {
            cb(results);
            clearInterval(interval);
        }
    }, 500);
};


razemTab([fun1, fun2, fun3, fun4], (dane) => {
    dane.forEach((element) => {
        console.log(`Przetwarzam wyniki funkcji: ${element}`);
    });
});