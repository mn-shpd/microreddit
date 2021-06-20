const express = require("express");
const router = express.Router();
//Klient do bazy.
const getDb = require("../db").getDb;
//Warstwa do upload'u zdjec.
const multer = require("multer");
const upload = multer({
    dest: "./uploads"
});
//File system.
const fs = require("fs");
//Path
const path = require("path");

router.route("/total")
    .get((req, res) => {
        if(!("subredditName" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'subredditName'."
            })
        }
        else {
            const db = getDb();
            db.query("SELECT COUNT(*) AS amount FROM post P "
            + "JOIN subreddit S ON P.subreddit_id = S.id WHERE S.name = $1", [req.query.subredditName], (err, result) => {
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

router.route("/user/total")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT COUNT(*) AS amount FROM post P "
            + "JOIN subreddit_user U ON P.subreddit_id = U.subreddit_id WHERE U.user_id = $1", [req.user.id], (err, result) => {
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

router.route("/search/total")
    .get((req, res) => {
        if(!("searchString" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'searchString'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT COUNT(*) AS total FROM post WHERE LOWER(content) LIKE LOWER($1)", ["%" + req.query.searchString + "%"], (err, result) => {
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

router.route("/:offset/:rows")
    .get((req, res) => {
        if(!("subredditName" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'subredditName'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT P.id, P.title, P.content, P.creation_date, P.subreddit_id, COALESCE(SUM(V.vote), 0) AS votes FROM post P "
            + "JOIN subreddit S ON P.subreddit_id = S.id "
            + "LEFT JOIN post_vote V ON P.id = V.post_id "
            + "WHERE S.name = $1 "
            + "GROUP BY P.id, P.title, P.content, P.creation_date, P.subreddit_id "
            + "ORDER BY P.id "
            + "OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.query.subredditName, req.params.offset, req.params.rows], (err, result) => {
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

router.route("/user/:offset/:rows")
    .get((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("SELECT P.id, P.title, P.content, P.creation_date, S.name AS subreddit_name, COALESCE(SUM(V.vote), 0) AS votes FROM post P "
            +"JOIN subreddit_user U ON P.subreddit_id = U.subreddit_id "
            +"LEFT JOIN post_vote V ON P.id = V.post_id "
            +"LEFT JOIN subreddit S ON P.subreddit_id = S.id "
            +"WHERE U.user_id = $1 "
            +"GROUP BY P.id, P.title, P.content, P.creation_date, S.name "
            +"ORDER BY P.id "
            +"OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.user.id, req.params.offset, req.params.rows], (err, result) => {
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

router.route("/search/:offset/:rows")
    .get((req, res) => {
        if(!("searchString" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'searchString'." 
            });
        }
        else {
            const db = getDb();
            db.query("SELECT * FROM post WHERE LOWER(content) LIKE LOWER($1) "
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

router.route("/img")
    .post(upload.single("img"), (req, res) => {
        if(req.isAuthenticated()) {
            if(!("title" in req.body)) {
                res.send({
                    message: "Brak elementu 'title' w body żądania."
                });
            }
            else if(!("content" in req.body)) {
                res.send({
                    message: "Brak elementu 'content' w body żądania."
                });
            }
            else if(!("file" in req)) {
                res.send({
                    message: "Brak elementu 'file' w żądaniu."
                });
            }
            else if(!("yturl" in req.body)) {
                res.send({
                    message: "Brak elementu 'yturl' w body żądania."
                });
            }
            else if(!("subredditId" in req.body)) {
                res.send({
                    message: "Brak elementu 'subredditId' w body żądania."
                });
            }
            else {
                const db = getDb();
                db.query("INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id)"
                + "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [req.body.title, req.body.content, req.protocol + "://" + req.get('host') + "/" + req.file.filename, req.body.yturl, new Date(), req.body.subredditId, req.user.id],
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
        }
        else {
            fs.unlink("./uploads/" + req.file.filename, (err) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("Przesłane zdjęcie usunięto (użytkownik niezalogowany).");
                }
            });
            res.send({
                message: "Nie jesteś zalogowany."
            })
        }
    });

router.route("/")
    .post((req, res) => {
        if(req.isAuthenticated()) {
            if(!("title" in req.body)) {
                res.send({
                    message: "Brak elementu 'title' w body żądania."
                });
            }
            else if(!("content" in req.body)) {
                res.send({
                    message: "Brak elementu 'content' w body żądania."
                });
            }
            else if(!("subredditId" in req.body)) {
                res.send({
                    message: "Brak elementu 'subredditId' w body żądania."
                });
            }
            else {
                const db = getDb();
                // date_trunc('seconds', now())
                db.query("INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id)"
                + "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [req.body.title, req.body.content, "", req.body.yturl, new Date(), req.body.subredditId, req.user.id],
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
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            })
        }
    });

router.route("/:id")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM post WHERE id=$1", [req.params.id], (err, result) => {
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
    .delete(async (req, res) => {
        if(req.isAuthenticated()) {
            try {
                const db = getDb();
                const checkResult = await db.query("SELECT M.* FROM subreddit_moderator M JOIN post P ON M.subreddit_id = P.subreddit_id "
                + "WHERE M.user_id=$1 AND P.id=$2", [req.user.id, req.params.id]);
                if(checkResult.rows.length !== 0) {
                    await db.query("BEGIN");
                    await db.query("DELETE FROM comment WHERE post_id=$1", [req.params.id]);
                    await db.query("DELETE FROM post_vote WHERE post_id=$1", [req.params.id]);
                    const result = await db.query("DELETE FROM post WHERE id=$1 RETURNING *", [req.params.id]);
                    await db.query("COMMIT");
                    res.send(result.rows);
                }
                else {
                    res.send({
                        message: "Nie jesteś moderatorem subreddit'a, dla którego przypisany jest ten post."
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
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

module.exports = router;
