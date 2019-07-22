const express = require("express");
const InitialPoint = require("../models/InitialPoint");

const router = express.Router();

router.get("/", (req, res, next) => {
  InitialPoint.find()
    .then(initialPoint => {
      res.json(initialPoint);
    })
    .catch(err => next(err));
});

module.exports = router;
