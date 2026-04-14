const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// send email
const sendReviewEmail = async (to, data) => {
  const templatePath = path.join(__dirname, "../templates/reviewApproved.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{businessName}}", data.businessName)
    .replace("{{rating}}", data.rating)
    .replace("{{content}}", data.content);

  await transporter.sendMail({
    from: `"LocalBoost" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Nouvel avis sur votre commerce",
    html
  });
};

module.exports = { sendReviewEmail };