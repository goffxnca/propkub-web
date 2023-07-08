// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const sgMail = require("@sendgrid/mail");
const { NO_REPLY_EMAIL, IS_PROD } = require("./constant");

const sendEmail = async ({
  templateId,
  templateData,
  from = NO_REPLY_EMAIL,
  to,
}) => {
  sgMail.setApiKey(
    "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"
  ); //put in env later

  const msg = {
    to, //dynamic later
    from,
    // subject: "ยินดีต้อนรับสมาชิกใหม่อีกครั้ง",
    // text: "คุณเป็นสมาชิกใหม่บนระบบของเรา ยินดีด้วย",
    // html: "<h2>คุณสามารถเข้าสู่ระบบได้ทันทีเมื่อไหร่ก็ได้ที่คุณต้องการ</h2>",
    template_id: templateId,
    dynamic_template_data: {
      ...templateData,
      titlePrefix: IS_PROD ? "" : "[TEST]",
    },
    // bcc: "phattharawit.s@gmail.com", //add to support@propkub.com later & once stable dropped.
  };

  return sgMail.send(msg);
};

module.exports = {
  sendEmail,
};
