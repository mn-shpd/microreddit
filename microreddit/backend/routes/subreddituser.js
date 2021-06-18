const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            if(!("subredditId" in req.query)) {
                res.send({
                    message: "Nie podano parametru query 'subredditId'."
                });
            }
            else {
                const db = getDb();
                db.query("SELECT * FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2", [req.user.id, req.query.subredditId], (err, result) => {
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
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    })
    .post(async (req, res) => {
        if(req.isAuthenticated()) {
            if(!("subredditId" in req.body)) {
                res.send({
                    message: "Nie podano elementu 'subredditId' w body żądania."
                });
            }
            else {
                const db = getDb();
                try {
                    await db.query("BEGIN");
                    const checkResult = await db.query("SELECT * FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2", [req.user.id, req.body.subredditId]);
                    if(checkResult.rows.length === 0) {
                        const result = await db.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1, $2) RETURNING *", [req.user.id, req.body.subredditId]);
                        db.query("COMMIT");
                        res.send(result.rows[0]);                    
                    }
                    else {
                        res.send({
                            message: "Obserwujesz już ten subreddit."
                        });
                    }
                } catch(err) {
                    console.log(err.stack);
                    db.query("ROLLBACK", (err) => {
                        if(err) { console.log("Nie udało się wycofać transakcji.") };
                    });
                    res.send({
                        message: "Błąd w przetwarzaniu zapytania przez bazę danych."
                    });
                }
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
            if(!("subredditId" in req.body)) {
                res.send({
                    message: "Nie podano elementu 'subredditId' w body żądania."
                });
            }
            else {
                const db = getDb();
                db.query("DELETE FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2 RETURNING *", [req.user.id, req.body.subredditId],
                (err, result) => {
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
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

module.exports = router;
