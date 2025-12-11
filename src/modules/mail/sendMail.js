import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "../../common/configs/environment.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const sendMail = async (
  toEmail,
  subject,
  template,
  attachments = [],
) => {
  const info = await transporter.sendMail({
    from: "Bee Star <no-reply@goticket.com>",
    to: toEmail,
    subject,
    html: template,
    attachments,
    replyTo: undefined,
  });

  console.log("Email sent: ", info.messageId);
};
