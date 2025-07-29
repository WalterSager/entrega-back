//    /src/services/email.service.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendPasswordResetEmail(to, resetLink) {
  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: "Restablece tu contraseña",
    html: `
      <h2>Solicitud de restablecimiento de contraseña</h2>
      <p>Haz clic en el botón para cambiar tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${resetLink}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Restablecer Contraseña
      </a>
    `,
  };

  return transporter.sendMail(mailOptions);
}
