const express = require("express");
const Fontaine = require("../models/Fontaine");

const router = express.Router();

router.get("/", (req, res, next) => {
  Fontaine.find()
    .then(fontaines => {
      res.json(fontaines);
    })
    .catch(err => next(err));
});

router.post("/", (req, res, next) => {
  let { address } = req.body;
  Fontaine.create({ address })
    .then(fontaine => {
      res.json({
        success: true,
        fontaine
      });
    })
    .catch(err => next(err));
});

module.exports = router;
