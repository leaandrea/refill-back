const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const cloudinaryUploader = require("../config/cloudinary.js");

router.post(
  "/signup",
  cloudinaryUploader.single("avatar"),
  (req, res, next) => {
    const avatar = req.file.secure_url;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    if (!lastname || !firstname || !password || !email) {
      res.status(400).json({ message: "Provide username and password" });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({
        message:
          "Please make your password at least 8 characters long for security purposes."
      });
      return;
    }

    User.findOne({ email }, (err, foundUser) => {
      if (err) {
        res.status(500).json({ message: "Username check went bad." });
        return;
      }

      if (foundUser) {
        res
          .status(400)
          .json({ message: "Username taken. Choose another one." });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const aNewUser = new User({
        firstname,
        lastname,
        password: hashPass,
        email: email,
        avatar: avatar
      });

      aNewUser.save(err => {
        if (err) {
          res
            .status(400)
            .json({ message: "Saving user to database went wrong." });
          return;
        }

        // Automatically log in user after sign up
        // .login() here is actually predefined passport method
        req.login(aNewUser, err => {
          if (err) {
            res.status(500).json({ message: "Login after signup went bad." });
            return;
          }
          // Send the user's information to the frontend
          // We can use also: res.status(200).json(req.user);
          //Maybe better not to send the hashed password back to the user : )

          const user = {
            firstname: aNewUser.firstname,
            lastname: aNewUser.lastname,
            avatar: aNewUser.avatar
          };

          res.status(200).json(user);
        });
      });
    });
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.

      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, err => {
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

router.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    //   const user = {
    //       firstname: req.user.firstname,
    //       lastname: req.user.lastname,
    //       avatar = req.user.avatar
    //   }

    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;
