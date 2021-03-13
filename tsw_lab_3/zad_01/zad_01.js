const tablica = [
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

let nowyObjekt = tablica.reduce((prev, curr) => {
    prev[curr.id] = {...curr};
    return prev;
}, {});

console.log(nowyObjekt);