const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/total")
    .get((req, res) => {
        if(!("postId" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'postId'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT COALESCE(SUM(vote), 0) AS votes FROM post_vote where post_id = $1", [req.query.postId], (err, result) => {
                if(err) {
                    console.log(err.stack);
                    res.send({
                        message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                    });
                }
                else {
                    res.send(result.rows[0]);
                }
            });
        }
    });

//Sprawdzenie oceny użytkownika.
router.route("/:postId")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT vote FROM post_vote WHERE post_id=$1 and user_id=$2", [req.params.postId, req.user.id], (err, result) => {
                if(err) {
                    console.log(err.stack);
                    res.send({
                        message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                    });
                }
                else if(result.rows.length === 0) {
                    res.send({
                        vote: 0
                    });
                }
                else {
                    res.send({
                        vote: result.rows[0].vote
                    })
                }
            });
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    })
//Oddanie glosu.
    .post((req, res) => {
        if(req.isAuthenticated()) {
            if(!("vote" in req.body)) {
                res.send({
                    message: "Brak elementu 'vote' w body żądania."
                });
            }
            else {
                const db = getDb();
                db.query("INSERT INTO post_vote (vote, user_id, post_id) VALUES ($1, $2, $3) RETURNING *", [req.body.vote, req.user.id, req.params.postId], (err, result) => {
                    if(err) {
                        console.log(err.stack);
                        res.send({
                            message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                        });
                    }
                    else {
                        res.send(result.rows[0]);
                    }
                });
            }
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    })
//Zaktualizowanie glosu.
    .put((req, res) => {
        if(req.isAuthenticated()) {
            if(!("vote" in req.body)) {
                res.send({
                    message: "Brak elementu 'vote' w body żądania."
                });
            }
            else {
                const db = getDb();
                db.query("UPDATE post_vote SET vote=$1 WHERE post_id=$2 AND user_id=$3 RETURNING *", [req.body.vote, req.params.postId, req.user.id], (err, result) => {
                    if(err) {
                        console.log(err.stack);
                        res.send({
                            message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                        });
                    }
                    else {
                        res.send(result.rows[0]);
                    }
                });
            }
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    })
    .delete((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("DELETE FROM post_vote WHERE post_id=$1 AND user_id=$2 RETURNING *", [req.params.postId, req.user.id], (err, result) => {
                if(err) {
                    console.log(err.stack);
                    res.send({
                        message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                    });
                }
                else {
                    res.send(result.rows[0]);
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
