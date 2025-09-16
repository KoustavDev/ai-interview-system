import nodemailer from "nodemailer";
import { emailVarificationTemplete } from "./templete.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendVerificationEmail(email, token) {
  try {
    const mailOptions = {
      from: {
        name: "Ai-interview-system",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Email verification!",
      html: emailVarificationTemplete(token),
      replyTo: process.env.EMAIL,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
     console.error("Error sending email:", error);
  }
}


