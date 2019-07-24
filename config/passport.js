const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require(".././models/User");

passport.serializeUser((user, done) => {
  // console.log("@serializeUser");
  // console.log(user);
  done(null, user._id);
  // hint :  here logged in user is saved to session, similar as :
  // req.session.passport.user = {id: '..'}
});

passport.deserializeUser((id, done) => {
  // console.log("@deserializeUser", id);
  UserModel.findById(id)
    .then(user => {
      console.log("j'ai trouvé user");
      console.log("cool, user fetched from db ", user);
      // adds user object to req.user
      done(null, user);
    })
    .catch(err => {
      console.log("not cool");
      done(err, null);
    });
});

// this function setup a local strategy and provides logic for login action
passport.use(
  new LocalStrategy(
    { usernameField: "username" }, // change default username credential to username
    function(username, passwd, next) {
      UserModel.findOne({ username: username })
        .then(user => {
          // console.log("@ new Strategy :::: found user in db ?", user);
          // db query success
          if (!user)
            // if user === null
            return next(null, false, { message: "Incorrect username" });
          if (!bcrypt.compareSync(passwd, user.password))
            // if provided password is not valid
            return next(null, false, {
              message: "Incorrect password"
            });
          else next(null, user); // it's all good my friend !
        })
        .catch(dbErr => {
          console.log(dbErr);
          next(dbErr, null);
        }); // if the db query fail...
    }
  )
);
