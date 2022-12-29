const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const mail = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
})

module.exports = mail;
