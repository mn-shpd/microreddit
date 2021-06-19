// Parametry konfiguracyjne
require("dotenv").config();
const port = process.env.PORT || 3000;
const secret = process.env.APP_SECRET || "$sekretny_$sekret";
// Express.js
const express = require("express");
const app = express();
// Sesja i ciasteczka
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// Polaczenie z baza.
const db = require("./db");
db.initDb();
// Serwer HTTP
const http = require("http");
const server = http.createServer(app);

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

// Socket.io
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:8081"
    }
  });

io.sockets.on("connection", (socket) => {
    console.log("Socket.io: połączono - " + socket.id);

    socket.on("joinPost", (postId) => {
        socket.join(`/post/${postId}`);
    });
    socket.on("joinSubreddit", (subredditId) => {
        socket.join(`/subreddit/${subredditId}`);
    });

    socket.on("deletedComment", (data) => {
        socket.to(`/post/${data.postId}`).emit("commentWasDeleted", data.comment);
    });
    socket.on("addedComment", (data) => {
        socket.to(`/post/${data.postId}`).emit("commentWasAdded", data.comment);
    });
    socket.on("deletedPost", (data) => {
        socket.to(`/post/${data.post.id}`).emit("postWasDeleted");
        socket.to(`/subreddit/${data.subredditId}`).emit("postWasDeleted", data.post);
    });

    socket.on("disconnect", () => {
        console.log("Socket.io: rozłączono - " + socket.id);
    });
});

// Routing
const user = require("./routes/user");
const subreddit = require("./routes/subreddit");
const post = require("./routes/post");
const postVote = require("./routes/postvote");
const comment = require("./routes/comment");
const subredditUser = require("./routes/subreddituser");
const subredditModerator = require("./routes/subredditmoderator");
app.use("/user", user);
app.use("/subreddit", subreddit);
app.use("/post", post);
app.use("/postvote", postVote);
app.use("/comment", comment);
app.use("/subreddituser", subredditUser);
app.use("/subredditmoderator", subredditModerator);

// Uruchomienie serwera HHTP(S)
server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});