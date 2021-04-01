// Postgres zainstalowany jako „kontener” docker-owy
// https://hub.docker.com/_/postgres

// Współpraca z mechanizmem „callbacków”
const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    password: "950204"
});
//-------------------------------------------------------
// UWAGA!!!
//-------------------------------------------------------
// Dane, takie jak użytkownik i hasło, raczej nie powinny
// być „wbudowane w kod”. Zamiast tego użyć można/należy
// modułu „dotenv” (https://github.com/motdotla/dotenv)
// Wykorzystanie modułu jest proste i zostało czytelnie
// opisane na wymienionej powyżej stronie.
//-------------------------------------------------------

client.connect();

client.query("SELECT $1::text AS msg", ["Ahoj przygodo!"], (err, res) => {
    console.log(err ? err.stack : res.rows[0].msg); // Ahoj przygodo!
    client.end();
});
