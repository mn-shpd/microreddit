const groupBy = (tab, key) => {

    let mapa = tab.reduce((prev, curr) => {
        if(prev.get(key(curr))) {
            let tempTab = prev.get(key(curr));
            tempTab.push(curr);
            prev.set(key(curr), tempTab);
        } else {
            prev.set(key(curr), [curr]);
        }
        return prev;
    }, new Map());

    return mapa;
};

let result = groupBy([3,2,4,4,3], n => n % 2 === 0);
console.log(result);