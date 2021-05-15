const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const httpserver = http.createServer(app);

const io = require("socket.io")(httpserver, {
  cors: {
    origin: "http://localhost:8081"
  }
});

app.use(cors());
app.use(express.json());

//Funkcja tworzaca tabele tasks (jesli nie istnieje).
function createTasksTable() {
  client.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks')", (err, result) => {
    if(err) {
      console.log(err.stack);
    }
    else {
      if(result.rows[0].exists === false) {
        client.query("CREATE TABLE Tasks (Id SERIAL, task VARCHAR NOT NULL, done BOOLEAN NOT NULL)", (err) => {
          console.log(err ? err.stack : "Tabela TASKS utworzona!");
        });
      }
      else {
        console.log("Tabela TASKS juz istnieje! :)");
      }
    }
  });
}

io.sockets.on("connection", (socket) => {
  console.log("Socket.io: połączono - " + socket.id);
  socket.on("changeInTasks", () => {
    socket.broadcast.emit("reloadTasks");
  });
  socket.on("disconnect", () => {
      console.log("Socket.io: rozłączono - " + socket.id);
  });
});

app.get("/tasks", async (req, res) => {
  client.query("SELECT * FROM tasks", (err, result) => {
    if(err) {
      console.log(err.stack);
    } else {
      return res.send(result.rows);
    }
  });
});

app.get("/tasks/:id", async (req, res) => {
  client.query("SELECT * FROM tasks WHERE id=$1", [req.params.id], (err, result) => {
    if(err) {
      console.log(err.stack);
    } else {
      return res.send(result.rows[0]);
    }
  });
});

app.post("/tasks", async (req, res) => {
  const params = req.body;
  client.query("INSERT INTO tasks (task, done) VALUES ($1, $2) RETURNING *", [params.task, params.done], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.send({ err: "Wystąpił błąd..." });
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.put("/tasks/:id", async (req, res) => {
  client.query("UPDATE tasks SET task=$1, done=$2 WHERE id=$3 RETURNING *", [req.body.task, req.body.done, req.params.id], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.send({ err: "Wystąpił błąd..." });
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.delete("/tasks/:id", async (req, res) => {
    client.query("DELETE FROM tasks WHERE id=$1 RETURNING *", [req.params.id], (err, result) => {
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
    createTasksTable();
    const port = process.env.PORT || 5000;
    httpserver.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("Connection error", err.stack));
