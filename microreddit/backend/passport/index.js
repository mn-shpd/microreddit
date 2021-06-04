const passport = require("passport");
const passportLocal = require("passport-local");
const getDb = require("../db").getDb;

passport.use(new passportLocal.Strategy({usernameField: "email", passwordField: "password"}, (email, password, done) => {
    const db = getDb();
    db.query("SELECT * FROM reddit_user WHERE email=$1", [email], (err, result) => {
      if(err) {
        console.log(err.stack);
        return done(err);
      }
      //Gdy odnaleziono uzytkownika.
      if(result.rows.length > 0) {
        const user = result.rows[0];
        //Gdy haslo zgodne.
        if(user.password === password) {
          return done(null, user);
        } 
        else {
          return done(null, false, {message: "Hasło jest nieprawidłowe."});
        }
      } 
      else {
        return done(null, false, {message: "Nie ma takiego użytkownika."});
      }
    });
  }));

  passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
  });
  
  passport.deserializeUser((id, cb) => {
    const db = getDb();
    console.log(`deserializeUser ${id}`);
    db.query("SELECT * FROM reddit_user WHERE id=$1", [id], (err, result) => {
      if(err) {
        console.log(err.stack);
      } else {
        cb(null, result.rows[0]);
      }
    });
  });

module.exports = passport;