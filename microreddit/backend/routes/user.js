const express = require("express");
const router = express.Router();
const passport = require("../passport");
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/login")
    .post(async (req, res, next) => {
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
              //Dorzucenie listy subreddit'ów użytkownika.
              const db = getDb();
              db.query("SELECT S.id, S.name FROM subreddit_moderator M "
              +"JOIN subreddit S ON M.subreddit_id = S.id WHERE user_id=$1", [user.id], (err, result) => {
                if(err) {
                  console.log(err.stack);
                  res.send({
                      message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                  });
                }
                else {
                  req.logIn(user, (err) => {
                    if (err) { return next(err); }
                    return res.send({
                      auth: true,
                      user: {id: user.id, username: user.nickname, userSubreddits: result.rows},
                    });
                  });
                }
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
  .post(async (req, res) => {
    const db = getDb();
    if(!("email" in req.body)) {
      res.send({
        message: "Nie podano elementu 'email' w body żądania."
      });
    }
    else if(!("username" in req.body)) {
      res.send({
        message: "Nie podano elementu 'username' w body żądania."
      });
    }
    else if(!("password" in req.body)) {
      res.send({
        message: "Nie podano elementu 'password' w body żądania."
      });
    }
    else {
      try {
        const db = getDb();
        const checkResult = await db.query("SELECT * FROM reddit_user WHERE email=$1 OR nickname=$2", [req.body.email, req.body.username]);
        let email_flag = false, username_flag = false;
        //Gdy odnaleziono uzytkownika.
        if(checkResult.rows.length > 0) {
          checkResult.rows.forEach(row => {
            if(row.email === req.body.email) {
              email_flag = true;
            }
            if(row.nickname === req.body.username) {
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
          const result = await db.query("INSERT INTO reddit_user (nickname, password, email) VALUES ($1, $2, $3) RETURNING *",
          [req.body.username, req.body.password, req.body.email]);
          res.send(result.rows);
        }
      } catch(err) {
        console.log(err.stack);
        res.send({
          message: "Błąd w przetwarzaniu zapytania przez bazę danych."
        });
      }
    }
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
  .put(async (req, res) => {
      if(req.isAuthenticated()) {
        console.log(req.user);
        if(!("email" in req.body)) {
          res.send({
            message: "Nie podano elementu 'email' w body żądania."
          });
        }
        else if(!("username" in req.body)) {
          res.send({
            message: "Nie podano elementu 'username' w body żądania."
          });
        }
        else {
          try {
            const db = getDb();
            const checkResult = await db.query("SELECT email, nickname FROM reddit_user WHERE email=$1 OR nickname=$2 "
            +"EXCEPT SELECT $3, $4", [req.body.email, req.body.username, req.user.email, req.user.nickname]);
            let email_flag = false, username_flag = false;
            //Gdy odnaleziono uzytkownika.
            if(checkResult.rows.length > 0) {
              checkResult.rows.forEach(row => {
                if(row.email === req.body.email) {
                  email_flag = true;
                }
                if(row.nickname === req.body.username) {
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
              const result = await db.query("UPDATE reddit_user SET nickname=$1, password=$2, email=$3 WHERE id=$4 "
              +"RETURNING id, nickname AS username, email, password",
              [req.body.username, req.body.password, req.body.email, req.user.id]);
              res.send(result.rows[0]);
            }
          } catch(err) {
            console.log(err.stack);
            res.send({
              message: "Błąd w przetwarzaniu zapytania przez bazę danych."
            });
          }
        }
      }
      else {
          res.send({
              message: "Nie jesteś zalogowany, więc nie możesz zaktualizować swoich danych."
          });
      }
  }); 

module.exports = router;
