const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET signup page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});


/* POST signup page */
router.post("/signup", (req, res) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("signup", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ username: theUsername }).then(user => {
      console.log(user)
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    bcrypt
      .hash(thePassword, 10)
      .then(hash => {
        return User.create({
          username: theUsername,
          password: hash
        });
      })
      .then(user => {
        res.send("user " + theUsername + " created ");
      })
      .catch(error => {
        console.log(error);
      });
  });
});



/* GET LOGIN page */
router.get("/login", (req, res, next) => {
    res.render("login");
  });

/* POST LOGIN page */
  router.post('/login', (req, res) => {
    let currentUser;
    User.findOne({username: req.body.username})
      .then(user => {
        if(!user) {
          res.send("user not found");
          return
        }
        currentUser = user
        return bcrypt.compare(req.body.password, user.password)
      })
      .then(passwordCorrect => {
        if(passwordCorrect) {
          req.session.currentUser = currentUser
          res.redirect("/auth/private")
        } else {
          res.send("incorrect password");
        }
      })
  })


/** PROTECTED PAGE */
router.use('/private', (req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in) go to the next step 
      next(); 
    } else {                      
      res.redirect("/auth/login");         
    }                            
  });                          
  router.get("/private", (req, res, next) => {    
    res.render("private/private.hbs");
  });     


/**LOGOUT */
  router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/auth/login");
    });
  });

module.exports = router;
