const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT M.*, S.name subreddit_name FROM subreddit_moderator M "
                    +"JOIN subreddit S ON M.subreddit_id = S.id WHERE user_id=$1", [req.user.id], (err, result) => {
                if(err) {
                    console.log(err.stack);
                    res.send({
                        message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                    });
                }
                else {
                    res.send(result.rows);
                }
            });
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

module.exports = router;
