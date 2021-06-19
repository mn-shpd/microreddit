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
                        message: "Błąd w połączeniu z bazą danych."
                    });
                }
                else {
                    res.send(result.rows[0]);
                }
            });
        }
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

router.route("/search")
    .get((req, res) => {
        if(!("searchString" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'searchString'." 
            });
        }
        else if(!("offset" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'offset'."
            });
        }
        else if(!("rows" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'rows'."
            });
        }
        else {
            const db = getDb();
            db.query("SELECT * FROM post WHERE LOWER(content) LIKE LOWER($1) "
                    +"ORDER BY id OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", ["%" + req.query.searchString + "%", req.query.offset, req.query.rows],
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
    });

router.route("/:id")
    .get((req, res) => {
        const db = getDb();
        db.query("SELECT * FROM post WHERE id=$1", [req.params.id], (err, result) => {
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

router.route("/")
    .post(upload.single("img"), (req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id)"
            + "VALUES ($1, $2, $3, $4, date_trunc('seconds', now()), $5, $6) RETURNING *",
            [req.body.title, req.body.content, req.protocol + "://" + req.get('host') + "/" + req.file.filename, req.body.yturl, req.body.subredditId, req.user.id],
            (err, result) => {
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

module.exports = router;
