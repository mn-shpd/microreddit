const defFun = (fun, types) => {
    fun.typeConstr = types;
    return fun;
};

const myFun = defFun((a, b) => a + b, ['number', 'number']);

console.log(myFun.typeConstr);
console.log(myFun(5,1));

function appFun(f) {
    let fArguments = Array.from(arguments);
    //Usuwa pierwszy element (funkcje do pozniejszego wywolania).
    fArguments.splice(0, 1);
    
    if(f.typeConstr !== undefined) {
        if(fArguments.length > f.typeConstr.length) {
            throw( {typerr: "Podano za dużo argumentów dla funkcji."});
        } else if (fArguments.length < f.typeConstr.length) {
            throw( {typerr: "Podano za mało argumentów dla funkcji."});
        }
        for(i = 0; i < fArguments.length; i++) {
            if(fArguments[i] !== undefined) {
                if(typeof fArguments[i] !== f.typeConstr[i]) {
                    throw( {typerr: "Niezgodność typu dla argumentu nr " + (i+1) + " funkcji."});
                }
            } else {
                throw({ typerr: "Nie podano argumentu nr " + (i+1) + " dla funkcji."});
            }
        }
    } else {
        throw({ typerr: "Funkcja nie posiada typeConstr!"});
    }

    return f.apply(this, fArguments);
};

try {
    console.log(appFun(myFun, 12, 13));
    console.log(appFun((a, b) => a+b, 2));
} catch (e) {
    console.log(e.typerr);
};