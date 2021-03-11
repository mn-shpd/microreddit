var tablica = [
    { 
      id: 'abc',
      name: 'Ala'
    },
    {
      id: 'def',
      name: 'Tomek'
    },
    {
      id: 'ghi',
      name: 'Jan'
    }
];

var nowyObjekt = tablica.reduce((prev, curr) => {
    prev[curr.id] = {...curr};
    return prev;
}, {});

console.log(nowyObjekt);