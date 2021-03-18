var fun1 = (url, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane z ${url}!`);
        cb('Dane pobrane funkcja nr 1...');
    }, 4000);
};

var fun2 = (url, cb) => {
    setTimeout(() => {
        console.log(`Pobieram dane z ${url}!`);
        cb('Dane pobrane funkcja nr 2...');
    }, 2000);
};

const poKolei = (fun1, fun2, cb) => {
    fun1('www.wp.pl', (dane) => {
        console.log(`Otrzymałem: ${dane}`);
        fun2('www.google.com', (dane) => {
            console.log(`Otrzymałem: ${dane}`);
            cb(dane);
        });
    });
};

poKolei(fun1, fun2, (dane) => {console.log(`Koniec przetwarzania: ${dane}`)});