const { Telegraf } = require("telegraf");

const { errors } = require("../errors/errorcodes");
// console.log(errors);
// const nodeHtmlToImage = require('node-html-to-image')
const bot = new Telegraf(process.env.botlockers_token);
const auth = require("./auth.controller");
const keyboards = require("../keyboards/keyboards");

const { TelegrafMongoSession } = require("telegraf-session-mongodb");

TelegrafMongoSession.setup(bot, "mongodb://localhost:27017/lockersDB")
  .then((client) => bot.launch())
  .catch((err) => console.log(`Failed to connect to the database: ${err}`));

function errorSend(ctx) {
  ctx.reply(
    "Не удалось сохранить данные.Попробуйте еще раз. Если ошибка сохранится напишите @brutor"
  );
}
function showMainKeyboard(ctx) {
  ctx.reply("Выберите действие", keyboards.mainKeyboard);
}
bot.hears(/^логин\s\w+/i, async (ctx) => {
  try {
    if (ctx.session.status == "needToConfirmLogin") {
      ctx.reply(`Мы уже отправили код на ваш логин (${ctx.session.winlogin})`);
      return;
    }

    if (ctx.session.status != "needLogin") {
      ctx.reply(`Вы уже в залогинены.`);
      return;
    }

    let winlogin = ctx.message.text.split(" ")[1];

    let tryTosendConfirmCode = await auth.sendConfirmationCode({
      winlogin: winlogin,
      tgUser: ctx.session,
    });
    if (tryTosendConfirmCode) {
      ctx.reply(
        `Ваш логин ${winlogin}. Мы отправили письмо вам на почту с кодом подтверждения. Введите его в формате:\nКод 1234`
      );
    } else {
      ctx.reply(
        `Ваш логин ${winlogin} не найден. Возможно тут ошибка? обратитесь к @brutor`
      );
    }
  } catch (err) {
    if (errors[err.message]) {
      ctx.reply(errors[err.message]);
    } else {
      errorSend(ctx);
    }
  }
});

bot.hears(/^код\s\w+/i, async (ctx) => {
  try {
    let tgUser = ctx.session;

    if (tgUser.status == "needLogin" || !tgUser.winlogin) {
      ctx.reply("Сначала введите логин");
      return;
    }

    if (tgUser.status != "needToConfirmLogin") {
      ctx.reply("Вы уже подтвердили логин");
      return;
    }

    let code = ctx.message.text.split(" ")[1];
    if (isNaN(Number(code)) || code.toString().length != 4) {
      ctx.reply("Неверный формат кода");
      return;
    }

    await auth.confirmCode({
      tgUser,
      code,
    });
    ctx.reply("Вы успешно вошли в систему");
    showMainKeyboard()
  } catch (err) {
    console.log(err);
    if (errors[err.message]) {
      ctx.reply(errors[err.message]);
    } else {
      errorSend(ctx);
    }
  }
});

bot.hears("Ввести другой логин", async (ctx) => {
ctx.session.status = 'needLogin'
ctx.reply("Введите новый логин, в формате: \nЛогин Login");
});

bot.on("message", async (ctx) => {
  let user = ctx.session;

  if (!user.status) {
    user.status = "needLogin";
  }
  if (!user.id || user.id != ctx.message.from.id) {
    user.id = ctx.message.from.id;
  }
  let status = user.status;

  if (status == "needLogin" || !status) {
    ctx.reply(
      "Ваш аккаунт телеграм не связан с учеткой, введите ваш логин, в формате: \nЛогин Login"
    );
  } else if (status == "needToConfirmLogin") {
    let login = user.winlogin;
    ctx.reply(
      `Мы отправили письмо вам на почту (${login}) с кодом подтверждения. Введите его в формате:\nКод 1234`,
      keyboards.loginKeyboard
    );
  } else if (status == "logged") {
    showMainKeyboard(ctx);
  }
});


bot.action("check__floors", (ctx) => {
  ctx.reply("Вы смотрите этажи");
  ctx.answerCbQuery()
});

bot.action("my__reservations", (ctx) => {
    console.log('action ')
    ctx.editMessageText('asd',keyboards.mainKeyboard2);
    // ctx.editMessageReplyMarkup(keyboards.mainKeyboard);
    ctx.answerCbQuery()
  });
module.exports = {
  bot,
};
