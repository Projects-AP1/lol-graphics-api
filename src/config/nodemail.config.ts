import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "lolgraphs342@gmail.com",
    pass: "dyidipuqrhhbrmmi",
  },
  tls: { rejectUnauthorized: false },
});

export default transporter;
