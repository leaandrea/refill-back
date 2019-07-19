const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

/* GET home page */

router.post("/contact", (req, res, next) => {
  // console.log(req);
  console.log(req.body);
  const { firstname, lastname, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASS
    }
  });

  // return console.log(transporter.options.auth.user);
  transporter
    .sendMail({
      from: email,
      to: transporter.options.auth.user,
      subject: `${subject}`,
      text: `${message}`,
      html: `
      <p>you got a message from ${firstname} - ${lastname}</p>
      <hr>
      <p>${message}</p>
      `
    })
    .then(info => res.send("email sent successfully"))
    .catch(error => {
      res.json({ error });
    });
});

module.exports = router;
