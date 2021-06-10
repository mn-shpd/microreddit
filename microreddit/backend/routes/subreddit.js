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

router.route("/:offset/:rows")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM subreddit ORDER BY id OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY", [req.params.offset, req.params.rows], (err, result) => {
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

router.route("/my/:offset/:rows")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT S.id, S.name, S.description FROM subreddit S JOIN subreddit_moderator M ON S.id = M.subreddit_id "
            + "WHERE M.user_id = $1 ORDER BY S.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.user.id, req.params.offset, req.params.rows],
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

router.route("/followed/:offset/:rows")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT S.id, S.name, S.description FROM subreddit S JOIN subreddit_user U ON S.id = U.subreddit_id "
            + "WHERE U.user_id = $1 ORDER BY S.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.user.id, req.params.offset, req.params.rows],
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
