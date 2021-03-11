const groupBy = (tab, key) => {
    const result = tab.reduce((prev, curr) => {
        if (typeof prev.get(key(curr)) === 'undefined') {
            var nowaTablica = new Array();
            prev.set(key(curr), nowaTablica.push(curr));
        } else {
            var tablica = prev.get(key(curr));
            tablica.push(curr);
            prev.set(key(curr), tablica);
        }
        return prev;
    }, new Map());

    return result;
};

const result = groupBy([3,2,4,4,3], n => n % 2 === 0);
// console.log(result);