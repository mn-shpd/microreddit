const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const httpserver = http.createServer(app);

app.use(cors({
  credentials: true,
  origin: 'http://localhost:8081'
}));

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

// ciasteczka
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

app.use(cookieParser());
app.use(expressSession({
    secret: "sekret",
    resave: false,
    saveUninitialized: false
}));

// Pasport.js
const passport = require("passport");
const passportLocal = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());

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

//socket.io
const io = require("socket.io")(httpserver, {
  cors: {
    origin: "http://localhost:8081"
  }
});

io.sockets.on("connection", (socket) => {
  console.log("Socket.io: połączono - " + socket.id);
  socket.on("changeInTasks", () => {
    socket.broadcast.emit("reloadTasks");
  });
  socket.on("disconnect", () => {
      console.log("Socket.io: rozłączono - " + socket.id);
  });
});

passport.use(new passportLocal.Strategy((username, password, done) => {
  client.query("SELECT * FROM users WHERE username=$1", [username], (err, result) => {
    if(err) {
      console.log(err.stack);
      return done(err);
    }
    //Gdy odnaleziono uzytkownika.
    if(result.rows.length > 0) {
      const user = result.rows[0];
      //Gdy haslo zgodne.
      if(user.password === password) {
        return done(null, user);
      } 
      else {
        return done(null, false, {message: "Password is incorrect!"});
      }
    } 
    else {
      return done(null, false, {message: "User was not found!"});
    }
  });
}));

passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user.id}`);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log(`deserializeUser ${id}`);
  client.query("SELECT * FROM users WHERE id=$1", [id], (err, result) => {
    if(err) {
      console.log(err.stack);
    } else {
      cb(null, result.rows[0]);
    }
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); 
    }
    if (!user) { 
      res.send({
        auth: false,
        message: info.message
      });
    }
    else {
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.send({
          auth: true,
          message: "Successfully authenticated!"
        });
      });
    }
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  if(req.isAuthenticated()) {
    req.logout();
    res.send({
      message: "Successfully logged out!"
    })
  }
  else {
    res.send({
      message: "You are not logged in!"
    });
  }
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
  if(req.isAuthenticated()) {
    const params = req.body;
    client.query("INSERT INTO tasks (task, done) VALUES ($1, $2) RETURNING *", [params.task, params.done], (err, result) => {
      if(err) {
        console.log(err.stack);
        res.send({ err: "Wystąpił błąd..." });
      } else {
        res.send(result.rows[0]);
      }
    });
  } 
  else {
    res.send({
      message: "You are not logged in!"
    });
  }
});

app.put("/tasks/:id", async (req, res) => {
  if(req.isAuthenticated()) {
    client.query("UPDATE tasks SET task=$1, done=$2 WHERE id=$3 RETURNING *", [req.body.task, req.body.done, req.params.id], (err, result) => {
      if(err) {
        console.log(err.stack);
        res.send({ err: "Wystąpił błąd..." });
      } else {
        res.send(result.rows[0]);
      }
    });
  } 
  else {
    res.send({
      message: "You are not logged in!"
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  if(req.isAuthenticated()) {
    client.query("DELETE FROM tasks WHERE id=$1 RETURNING *", [req.params.id], (err, result) => {
      if(err) {
        console.log(err.stack);
        res.send({ err: "Wystąpił błąd..." });
      } else {
        res.send(result.rows[0]);
      }
    });
  }
  else {
    res.send({
      message: "You are not logged in!"
    });
  }
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