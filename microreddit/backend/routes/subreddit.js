const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;

router.route("/total")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT COUNT(*) AS amount FROM subreddit", (err, result) => {
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
    });

router.route("/search/total")
    .get((req, res) => {
        if(!("searchString" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'searchString'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT COUNT(*) AS total FROM subreddit WHERE LOWER(name) LIKE LOWER($1)", ["%" + req.query.searchString + "%"], (err, result) => {
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

router.route("/my/total")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT COUNT(*) AS amount FROM subreddit S JOIN subreddit_moderator M ON S.id = M.subreddit_id "
            + "WHERE M.user_id = $1", [req.user.id], (err, result) => {
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

router.route("/followed/total")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT COUNT(*) AS amount FROM subreddit S JOIN subreddit_user U ON S.id = U.subreddit_id "
            + "WHERE U.user_id = $1", [req.user.id],
            (err, result) => {
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

router.route("/")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM subreddit ORDER BY id", (err, result) => {
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
    })
    .post(async (req, res) => {
        if(req.isAuthenticated()) {
            if(!("name" in req.body)) {
                res.send({
                    message: "Brak elementu 'name' w body żądania."
                });
            }
            else if(!("description" in req.body)) {
                res.send({
                    message: "Brak elementu 'description' w body żądania."
                });
            }
            else {
                const db = getDb();
                try {
                    await db.query("BEGIN");
                    const checkResult = await db.query("SELECT * FROM subreddit WHERE name=$1", [req.body.name]);
                    if(checkResult.rows.length === 0) {
                        const result = await db.query("INSERT INTO subreddit (name, description) VALUES ($1, $2) RETURNING *", [req.body.name, req.body.description]);
                        await db.query("INSERT INTO subreddit_moderator (user_id, subreddit_id) VALUES ($1, $2)", [req.user.id, result.rows[0].id]);
                        await db.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1, $2)", [req.user.id, result.rows[0].id]);
                        db.query("COMMIT");
                        res.send(result.rows[0]);
                    }
                    else {
                        res.send({
                            message: "Subreddit o takiej nazwie już istnieje."
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
    });

router.route("/:offset/:rows")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT S.*, (SELECT COUNT(*) FROM subreddit_user U WHERE U.subreddit_id = S.id) AS followers "
        +"FROM subreddit S ORDER BY id OFFSET $1 ROWS FETCH FIRST $2 ROWS ONLY", [req.params.offset, req.params.rows], (err, result) => {
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
    });

router.route("/search/:offset/:rows")
    .get((req, res) => {
        if(!("searchString" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'searchString'." 
            });
        }
        else {
            const db = getDb();
            db.query("SELECT * FROM subreddit WHERE LOWER(name) LIKE LOWER($1) "
                    +"ORDER BY id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", ["%" + req.query.searchString + "%", req.params.offset, req.params.rows],
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
    });

router.route("/my/:offset/:rows")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT S.*, (SELECT COUNT(*) FROM subreddit_user U WHERE U.subreddit_id = S.id) AS followers "
            + "FROM subreddit S JOIN subreddit_moderator M ON S.id = M.subreddit_id "
            + "WHERE M.user_id = $1 ORDER BY S.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.user.id, req.params.offset, req.params.rows],
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
            db.query("SELECT S.*, (SELECT COUNT(*) FROM subreddit_user U WHERE U.subreddit_id = S.id) AS followers "
            + "FROM subreddit S JOIN subreddit_user U ON S.id = U.subreddit_id "
            + "WHERE U.user_id = $1 ORDER BY S.id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.user.id, req.params.offset, req.params.rows],
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
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

router.route("/byname")
    .get((req, res) => {
        if(!("name" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'name'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT S.*, (SELECT COUNT(*) FROM post P WHERE P.subreddit_id = S.id) AS posts, "
            +"(SELECT COUNT(*) FROM subreddit_user U WHERE U.subreddit_id = S.id) AS followers FROM subreddit S WHERE name=$1", [req.query.name], (err, result) => {
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

router.route("/:id")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM subreddit WHERE id=$1", [req.params.id], (err, result) => {
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
    })
    .put(async (req, res) => {
        if(req.isAuthenticated()) {
            if(!("description" in req.body)) {
                res.send({
                    message: "Nie podano elementu 'description' w body żądania."
                })
            }
            else {
                try {                
                    const db = getDb();
                    const checkResult = await db.query("SELECT * FROM subreddit_moderator WHERE user_id=$1 AND subreddit_id=$2", [req.user.id, req.params.id]);
                    if(checkResult.rows.length !== 0) {
                        const result = await db.query("UPDATE subreddit SET description=$1 WHERE id=$2 RETURNING *", [req.body.description, req.params.id]);
                        res.send(result.rows);
                    }
                    else {
                        res.send({
                            message: "Nie jesteś moderatorem tego subreddit'a."
                        });
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
                message: "Nie jesteś zalogowany."
            });
        }
    })

module.exports = router;
