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
            db.query("SELECT COUNT(*) AS total FROM comment WHERE post_id = $1", [req.query.postId], (err, result) => {
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
        if(!("postId" in req.query)) {
            res.send({
                message: "Nie podano parametru query 'postId'." 
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
            db.query("SELECT C.id, C.content, U.nickname FROM comment C "
                    +"JOIN reddit_user U ON C.user_id = U.id "
                    +"WHERE post_id = $1 "
                    +"ORDER BY id DESC "
                    +"OFFSET $2 ROWS FETCH FIRST $3 ROWS ONLY", [req.query.postId, req.query.offset, req.query.rows], (err, result) => {
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
    })
    .post((req, res) => {
        if(req.isAuthenticated()) {
            if(!("postId" in req.body)) {
                res.send({
                    message: "Nie podano elementu 'postId' w body żadania."
                });
            }
            else if(!("comment" in req.body)) {
                res.send({
                    message: "Nie podano elementu 'comment' w body żądania."
                });
            }
            else {
                const db = getDb();
                db.query("INSERT INTO comment (content, parent_comment_id, user_id, post_id) "
                        +"VALUES ($1, null, $2, $3) RETURNING *, (SELECT U.nickname FROM reddit_user U "
                        +"WHERE U.id = user_id)", [req.body.comment, req.user.id, req.body.postId], (err, result) => {
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
        }
        else {
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

router.route("/:commentId")
    .delete((req, res) => {
        if(req.isAuthenticated()) {
            const db = getDb();
            db.query("DELETE FROM comment WHERE id=$1 RETURNING *", [req.params.commentId], (err, result) => {
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
            res.send({
                message: "Nie jesteś zalogowany."
            });
        }
    });

module.exports = router;
