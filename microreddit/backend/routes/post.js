const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/amount")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT COUNT(*) AS amount FROM post P "
        + "JOIN subreddit S ON P.subreddit_id = S.id WHERE S.name = $1", [req.query.name], (err, result) => {
            if(err) {
                console.log(err.stack);
                res.send({
                    message: "Błąd w połączeniu z bazą danych."
                });
            }
            else {
                res.send(result.rows[0]);
            }
        });
    });

router.route("/")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT P.id, P.title, P.content, P.creation_date, P.subreddit_id FROM post P "
        + "JOIN subreddit S ON P.subreddit_id = S.id WHERE S.name = $1 ORDER BY P.id "
        + " OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.query.name, req.query.offset, req.query.rows], (err, result) => {
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
    });

module.exports = router;
