var fun1 = function (url, results) {
    setTimeout(() => {
        console.log(`Pobrałem zawartość: ${url}`);
        results.push(`Pobrana zawartość: ${url}`);
    }, 4000);
};

var fun2 = function (url, results) {
    setTimeout(() => {
        console.log(`Pobrałem zawartość: ${url}`);
        results.push(`Pobrana zawartość: ${url}`);
    }, 2000);
};


const razem = (fun1, fun2, cb) => {
    var przetworz = (results) => {
        fun1('www.wp.pl', results);
        fun2('www.google.com', results);
        cb(results);
    };
};

razem(fun1, fun2, (dane) => {
    console.log(`Przetwarzam wyniki funkcji nr 1 (${dane[0]}) i funkcji nr 2 (${dane[1]})`);
    });

// //Promesy

// var fun1 = function (url) {
//     return new Promise( (resolve) => {
//         setTimeout(() => {
//             resolve(`Pobrana zawartość: ${url}`);
//         }, 4000);
//     });
// };

// var fun2 = function (url) {
//     return new Promise( (resolve) => {
//         setTimeout(() => {
//             resolve(`Pobrana zawartość: ${url}`);
//         }, 4000);
//     });
// };

// const razem = (fun1, fun2, cb) => {
//     let p1 = fun1('www.wp.pl');
//     let p2 = fun2('www.google.com');
//     Promise.all([p1, p2])
//         .then(results => {
//             cb(results);
//         });
// };

// razem(fun1, fun2, (dane) => {
//     console.log(`Przetwarzam wyniki funkcji nr 1 (${dane[0]}) i funkcji nr 2 (${dane[1]})`);
//     });

