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

module.exports = function send(text, email, subject='Confirm login') {
  return transporter.sendMail({
    from: {
      name: 'Stocks',
      address: 'ibayak2@ya.ru'
    },
    to: email,
    subject,
    text,
  });
}