const express = require("express");
const router = express.Router();
const passport = require("../passport");
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/login")
    .post((req, res, next) => {
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
                  user: {id: user.id, username: user.nickname},
                  message: "Zalogowałeś się!"
                });
              });
            }
          })(req, res, next);
    });

router.route("/logout")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            req.logout();
            res.send({
              message: "Wylogowałeś się!"
            })
          }
        else {
            res.send({
                message: "Nie jesteś zalogowany, więc nie możesz się wylogować."
            });
        }
    });

router.route("/register")
  .post((req, res) => {
    const db = getDb();
    const req_data = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
    db.query("SELECT * FROM reddit_user WHERE email=$1 OR nickname=$2", [req_data.email, req_data.username], (err, result) => {
      let email_flag = false, username_flag = false;

      if(err) {
        console.log(err.stack);
        res.send({
          message: "Błąd w połączeniu z bazą danych."
        });
      }
      //Gdy odnaleziono uzytkownika.
      else if(result.rows.length > 0) {
        result.rows.forEach(row => {
          if(row.email === req_data.email) {
            email_flag = true;
          }
          if(row.nickname === req_data.username) {
            username_flag = true;
          }
        });
        //Gdy email i username wystąpiły już u jakichś użytkowników.
        if(email_flag && username_flag) {
          res.send({
            message: "E-mail i nazwa użytkownika są już w użyciu."
          });
        }
        //Gdy email wystapił juz u jakiegoś użytkownika.
        else if(email_flag) {
          res.send({
            message: "E-mail jest już w użyciu."
          });
        }
        //Gdy nazwa użytkownika wystapiła juz u jakiegoś użytkownika.
        else if(username_flag) {
          res.send({
            message: "Nazwa użytkownika jest już w użyciu."
          });
        }
      } 
      else {
        db.query("INSERT INTO reddit_user (nickname, password, email) VALUES ($1, $2, $3) RETURNING *", [req_data.username, req_data.password, req_data.email], (err, result) => {
          if(err) {
            console.log(err.stack);
            res.send({ message: "Błąd w połączeniu z bazą danych." });
          } else {
            res.send(result.rows[0]);
          }
        });
      }
    });
  });

router.route("/")
  .get((req, res) => {
      if(req.isAuthenticated()) {
          res.send({
            id: req.user.id,
            username: req.user.nickname,
            email: req.user.email,
            password: req.user.password
          });
      }
      else {
          res.send({
              message: "Nie jesteś zalogowany, więc nie możesz pobrać swoich danych."
          });
      }
  });

router.route("/")
  .put((req, res) => {
      if(req.isAuthenticated()) {
        db = getDb();
        db.query("UPDATE reddit_user SET nickname=$1, password=$2, email=$3 WHERE id=$4 RETURNING *",
        [req.body.username, req.body.password, req.body.email, req.user.id], (err, result) => {
          if(err) {
              console.log(err.stack);
              res.send({
                  message: "Błąd w połączeniu z bazą danych."
              });
          }
          else {
              res.send(result.rows);
          }
      });
      }
      else {
          res.send({
              message: "Nie jesteś zalogowany, więc nie możesz zaktualizować swoich danych."
          });
      }
  }); 

module.exports = router;
