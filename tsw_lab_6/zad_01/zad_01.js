require('dotenv').config();

const { Client } = require("pg");

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS
});

client.connect();

client.query("CREATE TABLE Movie (Id SERIAL, Name VARCHAR NOT NULL, Genre VARCHAR NOT NULL, ReleaseYear INT NOT NULL)", (err) => {
    console.log(err ? err.stack : "Tabela MOVIE utworzona!");
    client.end();
});