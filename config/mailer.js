const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

/* GET home page */

router.post("/contact", (req, res, next) => {
  const { firstname, lastname, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASS
    }
  });

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
    .then(info => {
      console.log(email);

      res.send("email sent successfully");
    })
    .catch(error => {
      res.json({ error });
    });
});

module.exports = router;
