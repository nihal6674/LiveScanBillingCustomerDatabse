const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME,
      },
      subject,
      text,
      html,
      headers: {
    "X-Entity-Ref-ID": `${Date.now()}-${Math.random()}`,
  },
    });
  } catch (error) {
    console.error("SENDGRID ERROR:", error.response?.body || error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
