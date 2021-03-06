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
// const cors = require("cors");
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

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

app.use("", express.static("../frontend/dist"));

// Passport
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Socket.io
const io = require("socket.io")(server, {
    // cors: {
    //   origin: process.env.CORS_ORIGIN
    // }
  });

io.sockets.on("connection", (socket) => {
    console.log("Socket.io: połączono - " + socket.id);

    socket.on("joinPost", (postId) => {
        socket.join(`/post/${postId}`);
    });
    socket.on("joinSubreddit", (subredditId) => {
        socket.join(`/subreddit/${subredditId}`);
    });
    socket.on("joinUserHome", () => {
        socket.join("userHome");
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
        socket.to("userHome").emit("postWasDeleted", data.post);
    });
    socket.on("voted", (data) => {
        socket.to(`/post/${data.postId}`).emit("someoneVoted", data.vote);
    });
    socket.on("addedPost", (data) => {
        socket.to(`/subreddit/${data.subredditId}`).emit("newPost", data.post);
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
app.use("/api/user", user);
app.use("/api/subreddit", subreddit);
app.use("/api/post", post);
app.use("/api/postvote", postVote);
app.use("/api/comment", comment);
app.use("/api/subreddituser", subredditUser);
app.use("/api/subredditmoderator", subredditModerator);

const path = require("path");
app.route("/*")
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });

// Uruchomienie serwera HTTP
server.listen(port, () => {
    console.log(`Serwer działa na porcie: ${port}`);
});