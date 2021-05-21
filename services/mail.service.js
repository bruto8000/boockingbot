const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "bee.bot.auth@yandex.ru",
    pass: process.env.botmail_password,
  },
});

let domains = {
  Калуга: "kaluga.beeline.ru",
  НиНо: "kaluga.beeline.ru",
  Перьм: "kaluga.beeline.ru",
};

async function sendMail({ winlogin, CSC, subject, body }) {
  let mailOptions = {
    from: '"Бот бронирования " <bee.bot.auth@yandex.ru>',
    to: `${winlogin}@${domains[CSC]}`, // list of receivers (who receives)
    subject: subject, // Subject line
    html: body, // html body
  };
console.log(mailOptions)
  let isSended = await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          resolve(false)
         console.log(error);
         return;
      }
     resolve(true);  
      console.log("Message sent: " + info.response);
    });
  });

  return isSended;
}


module.exports = {
    sendMail
}