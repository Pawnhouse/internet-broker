const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_LOGIN,
    pass: process.env.YANDEX_PASSWORD,
  },
});

module.exports = function send(oneTimePassword, email) {
  const text = 'Your one-time password is:\n' + oneTimePassword;
  return transporter.sendMail({
    from: {
      name: 'Authentication system',
      address: 'ibayak2@ya.ru'
    },
    to: email,
    subject: 'Confirm login',
    text,
  });
}