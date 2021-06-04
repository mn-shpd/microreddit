const express = require("express");
const router = express.Router();
//Klient do bazy.
const passport = require("../passport");

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
                message: "Nie jesteś zalogowany, więc nie możesz się wylogować..."
            });
        }
    });

module.exports = router;
