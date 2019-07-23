const express = require("express");
const Fontaine = require("../models/Fontaine");
const filterData = require("../seeds/feedMyDb");

const router = express.Router();

router.get("/", (req, res, next) => {
  Fontaine.find()
    .then(fontaines => {
      res.json(fontaines);
    })
    .catch(err => next(err));
});

router.post("/", (req, res, next) => {
  let {
    gazeuse,
    address,
    verified,
    potable,
    lat,
    lng,
    en_service,
    type,
    name
  } = req.body;
  Fontaine.create({
    gazeuse,
    address,
    verified,
    potable,
    lat,
    lng,
    en_service,
    type,
    name
  })
    .then(fontaine => {
      res.json({
        success: true,
        fontaine
      });
    })
    .catch(err => next(err));
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  Fontaine.findByIdAndDelete(req.params.id)
    .then(dbRes => {
      console.log(dbRes);
      res.status(200).json(dbRes);
    })
    .catch(dbErr => res.send(dbErr));
});

router.patch("/:id", (req, res) => {
  console.log("YOYOYO", req.body);
  Fontaine.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(dbRes => {
      console.log(dbRes);
      res.status(200).json(dbRes);
    })
    .catch(dbErr => res.send(dbErr));
});

module.exports = router;
