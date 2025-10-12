import nodemailer from "nodemailer";
const sendEmail = async (options) => {
  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT, // if secure false port = 587, if true port= 465
    // secure: true,
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: `Electro El-Hany Shop <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

export default sendEmail;
