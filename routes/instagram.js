const express = require("express");

const router = express.Router();

router.get("/instagram", (req, res) => {
  res.redirect("https://www.instagram.com/refill_paris/?hl=fr");
});

module.exports = router;
