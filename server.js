const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");
require("./config/database");

const app = express();

// Set "Access-Control-Allow-Origin" header
app.use(
  cors({
    origin: (origin, cb) => {
      cb(null, origin && origin.startsWith("http://localhost:"));
    },
    optionsSuccessStatus: 200,
    credentials: true
  })
);

// app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the public folder to "~/client/build/"
// Example: http://localhost:5000/favicon.ico => Display "~/client/build/favicon.ico"
app.use(express.static(path.join(__dirname, "../client/build")));

// Enable authentication using session + passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "irongenerator",
    resave: true,
    saveUninitialized: true
    // store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// passport init
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", require("./routes/index"));
app.use(require("./routes/auth"));
app.use("/api/fontaines", require("./routes/fontaines"));
app.use("/api/initialPoints", require("./routes/initialPoints"));
const mailerRouter = require("./config/mailer");
app.use(mailerRouter);
// For any routes that starts with "/api", catch 404 and forward to error handler
app.use("/api/*", (req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// For any other routes, redirect to the index.html file of React

// Error handler
app.use((err, req, res, next) => {
  console.error("----- An error happened -----");
  console.error(err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(err.status || 500);

    // A limited amount of information sent in production
    if (process.env.NODE_ENV === "production") res.json(err);
    else
      res.json(
        JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
      );
  }
});

app.listen(process.env.PORT, () => {
  console.log("App hosted on: ", process.env.SITE_URL);
});

module.exports = app;
