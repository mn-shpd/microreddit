const express = require("express");

const app = express();
app.use(express.json());

//Funkcja tworzaca tabele movie (jesli nie istnieje).
function createMovieTable() {
  client.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'movie')", (err, result) => {
    if(err) {
      console.log(err.stack);
    }
    else {
      if(result.rows[0].exists === false) {
        client.query("CREATE TABLE Movie (Id SERIAL, Name VARCHAR NOT NULL, Genre VARCHAR NOT NULL, ReleaseYear INT NOT NULL)", (err) => {
          console.log(err ? err.stack : "Tabela MOVIE utworzona!");
        });
      }
      else {
        console.log("Tabela MOVIE juz istnieje! :)");
      }
    }
  });
}
  // 

app.get("/movies", async (req, res) => {
  client.query("SELECT * FROM movie", (err, result) => {
    if(err) {
      console.log(err.stack);
    } else {
      return res.send(result.rows);
    }
  });
});

app.get("/movies/:id", async (req, res) => {
  client.query("SELECT * FROM movie WHERE id=$1", [req.params.id], (err, result) => {
    if(err) {
      console.log(err.stack);
    } else {
      return res.send(result.rows[0]);
    }
  });
});

app.post("/movies", async (req, res) => {
  const params = req.body;
  client.query("INSERT INTO movie (name, genre, releaseyear) VALUES ($1, $2, $3) RETURNING *", [params.name, params.genre, params.releaseyear], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.send({ err: "Wystąpił błąd..." });
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.put("/movies/:id", async (req, res) => {
  const params = req.body;
  client.query("UPDATE movie SET name=$1, genre=$2, releaseyear=$3 WHERE id=$4 RETURNING *", [params.name, params.genre, params.releaseyear, req.params.id], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.send({ err: "Wystąpił błąd..." });
    } else {
      res.send(result.rows[0]);
    }
  });
});

require("dotenv").config();
const dbConnData = {
    host: process.env.PGHOST || "127.0.0.1",
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASS
};


const { Client } = require("pg");
const client = new Client(dbConnData);

console.log("Connection parameters: ");
console.log(dbConnData);
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    createMovieTable();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("Connection error", err.stack));
