// Parametry konfiguracyjne
require("dotenv").config();
// Express.js
const express = require("express");
const app = express();
// Sesja i ciasteczka
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// Polaczenie z baza.
const db = require("./db");
db.initDb();
// Serwer HTTPS
// const https = require("https");
const fs = require("fs"); // dostęp do systemu plików
const http = require("http");
const server = http.createServer(app);
// const server = https.createServer({
//     key: fs.readFileSync("./ssl/privateKey.key"),
//     cert: fs.readFileSync("./ssl/certificate.crt")
// }, app);
// Konfiguracja aplikacji
const port = process.env.PORT || 3000;
const secret = process.env.APP_SECRET || "$sekretny_$sekret";

// cors
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:8081",
    credentials: true
}));

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.use(cookieParser());
app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));

//Warstwa do ładowania przesłanych zdjęć.
app.use(express.static(__dirname + "/uploads"));

// Passport
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Routing
const user = require("./routes/user");
const subreddit = require("./routes/subreddit");
const post = require("./routes/post");
const postVote = require("./routes/postvote");
const comment = require("./routes/comment");
app.use("/user", user);
app.use("/subreddit", subreddit);
app.use("/post", post);
app.use("/postvote", postVote);
app.use("/comment", comment);

// Uruchomienie serwera HHTP(S)
server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});