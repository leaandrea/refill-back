const express = require("express");
const router = new express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const minPasswordLength = 4;
const UserModel = require("../models/User");

router.post("/signup", (req, res, next) => {
  // console.log("file ?", req.file);
  console.log("req body", req.body);
  const { username, password } = req.body;

  var errorMsg = null;

  // more on http status
  // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

  if (!username || !password)
    errorMsg = {
      message: "Provide username and password",
      status: "warning",
      httpStatus: 403 // 403	Forbidden
    };

  if (password.length < minPasswordLength)
    errorMsg = {
      message: `Please make your password at least ${minPasswordLength} characters`,
      status: "warning",
      httpStatus: 403 // 403	Forbidden
    };

  if (errorMsg) return res.status(errorMsg.httpStatus).json(errorMsg);

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
  // more info : https://en.wikipedia.org/wiki/Salt_(cryptography)

  const newUser = {
    username,
    password: hashPass
  };

  UserModel.create(newUser)
    .then(newUserFromDB => {
      // passport in action below
      req.login(newUserFromDB, err => {
        console.log(newUserFromDB);
        console.log("passport login error", err);
        if (err) {
          console.log("lol");
          return res.status(500).json({
            message: "Something went wrong with automatic login after signup"
          });
        }
        console.log("OKKKKKKKKK");
        res.status(200).json(req.user);
      });
    })
    .catch(apiErr => {
      const error = {
        11000: "The email already exists in database"
      };
      // you may want to use more error code(s) for precise error handling ...

      const message = {
        text: `Something went wrong saving user to Database : ${
          error[apiErr.code]
        }`,
        status: "warning"
      };

      res.status(409).json({ message }); // 409	Conflict
      return;
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, failureDetails) => {
    var errorMsg = null;

    if (err) {
      console.log("login error details", failureDetails);

      errorMsg = {
        message: "Something went wrong authenticating user",
        status: "error",
        httpStatus: 520
      };
    }

    if (!user)
      errorMsg = {
        message: "sorry, we couldn't find that account",
        status: "warning",
        httpStatus: 408
      };

    if (errorMsg) return res.status(errorMsg.httpStatus).json(errorMsg);

    req.logIn(user, function(err) {
      if (err) {
        console.log("passport login error", err);
        return res.json({ message: "Something went wrong logging in" });
      }
      // We are now logged in (notice here, only req._id is sent back to client)
      // You may find usefull to send some other infos
      // dont send sensitive informations back to the client
      // let's choose the exposed user below
      const { _id: id, username } = req.user;
      next(
        res.status(200).json({
          loginStatus: true,
          user: {
            id,
            username
          }
        })
      );
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  console.log("coucou logout");
  req.logout(); // utils function provided by passport
  res.json({ message: "Success" });
});

router.get("/loggedin", (req, res, next) => {
  // console.log("ask is loggedin ???", req.isAuthenticated());
  if (req.isAuthenticated()) {
    // method provided by passport
    const { _id: id, username } = req.user;
    return res.status(200).json({
      loginStatus: true,
      message: "authorized",
      user: {
        id,
        username
      }
    });
  }
  res.status(403).json({ loginStatus: false, message: "Unauthorized" });
});

module.exports = router;
