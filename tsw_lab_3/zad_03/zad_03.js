const groupBy = (tab, key) => {
    let trueTab = [];
    let falseTab = [];
    tab.forEach(el => {
        if(key(el)) {
            trueTab.push(el);
        } else {
            falseTab.push(el);
        }
    });

    let mapa = new Map();
    mapa.set(true, trueTab);
    mapa.set(false, falseTab);

    return mapa;
};

let result = groupBy([3,2,4,4,3], n => n % 2 === 0);
console.log(result);