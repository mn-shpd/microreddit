String.prototype.podstaw = function(dane) {
    let thisValue = this.valueOf();
    for (var prop in dane) {
        thisValue = thisValue.replace("{" + prop + "}", dane[prop]);
    }
    return thisValue;
}

let szablon =
  '<table border="{border}">' +
  '  <tr><td>{first}</td><td>{last}</td></tr>' +
  '</table>';

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

console.log(szablon.podstaw(dane));