const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM subreddit", (err, result) => {
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

router.route("/:id")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM subreddit WHERE id=$1", [req.params.id], (err, result) => {
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

router.route("/:id")
    .put((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            const updatedSub = {
                name: req.body.name,
                description: req.body.description
            };
            db.query("UPDATE subreddit SET name=$1, description=$2 WHERE id=$3 RETURNING *", [updatedSub.name, updatedSub.description, req.params.id],
            (err, result) => {
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
                message: "Nie jesteś zalogowany."
            });
        }
    });

module.exports = router;
