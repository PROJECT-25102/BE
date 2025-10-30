import nodemailder from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "../../common/configs/environment.js";

const transporter = nodemailder.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const sendMail = async (toEmail, subject, template) => {
  const info = await transporter.sendMail({
    from: "Bee Star <no-reply@goticket.com>",
    to: toEmail,
    subject: `${subject}`,
    html: template,
    replyTo: undefined,
  });
  console.log("Email send: %s", info.messageId);
};
