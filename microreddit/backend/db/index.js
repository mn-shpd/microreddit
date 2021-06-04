const { Client } = require("pg");

let db;

function initDb() {

    const dbConnData = {
        host: process.env.PGHOST || "127.0.0.1",
        port: process.env.PGPORT || 5432,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASS
    };

    if(db === undefined) {
        db = new Client(dbConnData);
        db.connect().then(() => {
            console.log("Connected to PostgreSQL database.");
        })
        .catch(err => console.error("Connection error", err.stack));
    }
}

function getDb() {
    if(db._connected) {
        return db;
    }
    else {
        console.log("Server is not connected to the database.");
    }
}

module.exports = {
    initDb,
    getDb
};