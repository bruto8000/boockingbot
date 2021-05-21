const { Telegraf } = require("telegraf");

const fs = require("fs");
const path = require("path");
const images = {
  floor_logo: fs.readFileSync(path.resolve(__dirname, '../images/floors/floors_logo.png')),
};
const { errors } = require("../errors/errorcodes");
// console.log(errors);
// const nodeHtmlToImage = require('node-html-to-image')

const bot = new Telegraf(process.env.botlockers_token);
const auth = require("./auth.controller");
const boocking = require("./boocking.controller");
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
      ctx.reply(
        `Мы уже отправили код на ваш логин (${ctx.session.winlogin})`,
        keyboards.loginKeyboard
      );
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
      ctx.reply(
        "Неверный формат кода, длина должна быть из 4х цифр, и без букв."
      );
      return;
    }

    await auth.confirmCode({
      tgUser,
      code,
    });
    ctx.reply("Вы успешно вошли в систему");
    showMainKeyboard(ctx);
  } catch (err) {
    console.log(err);
    if (errors[err.message]) {
      ctx.reply(errors[err.message]);
    } else {
      errorSend(ctx);
    }
  }
});

bot.on("message", async (ctx) => {
  let user = ctx.session;

  if (!user.status) {
    user.status = "needLogin";
  }
  if (!user.id || user.id != ctx.message.from.id) {
    user.id = ctx.message.from.id;
  }
  if (user.status == "needLogin" || !user.status) {
    ctx.reply(
      "Ваш аккаунт телеграм не связан с учеткой, введите ваш логин, в формате: \nЛогин Login"
    );
  } else if (user.status == "needToConfirmLogin") {
    ctx.reply(
      `Мы отправили письмо вам на почту (${user.winlogin}) с кодом подтверждения. Введите его в формате:\nКод 1234`,
      keyboards.loginKeyboard
    );
  } else if (user.status == "logged") {
    showMainKeyboard(ctx);
  }
});


bot.action("another_login", (ctx) => {
  ctx.session.status = "needLogin";
  ctx.editMessageText("Введите новый логин, в формате: \nЛогин Login");

  ctx.answerCbQuery();
});

bot.on("callback_query", (ctx, next) => {
  next();
});

bot.action("check_floors", async (ctx) => {
  let floors;
  try {
    floors = await boocking.getFloors();
  } catch (err) {
    console.log(err);
    if (errors[err] || errors[err.message]) {
      ctx.reply(errors[err] || errors[err.message]);
    } else {
      errorSend(ctx);
    }
    return;
  }

  try {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: { source: images.floor_logo },
      },
      keyboards.makeFloorsKeyboard(floors)
    );
  } catch (err) {
  console.log(err)
    await ctx.replyWithPhoto({source :images.floor_logo}, keyboards.makeFloorsKeyboard(floors));
  }
  ctx.answerCbQuery();
});


bot.action("my_reservations", async (ctx) => {
  try {
    await ctx.editMessageText("Смотрите мои записи", keyboards.mainKeyboard);
  } catch (err) {
    await ctx.reply("Смотрите мои записи", keyboards.mainKeyboard);
  }
  ctx.answerCbQuery();
});



bot.action(/getFloorImage_/, async (ctx) => {
  let level = ctx.update.callback_query.data.split("_")[1];
  let floors = await boocking.getFloors( level );
  let image = floors[0].image;

  try {
    await ctx.editMessageMedia(
      { type: "photo", media: { source: image } },
      keyboards.makeCurrentFloorKeyboard()
    );
  } catch (err) {
    await ctx.replyWithPhoto(
      { source: image },
      keyboards.makeCurrentFloorKeyboard()
    );
  }

  ctx.answerCbQuery();
});

module.exports = {
  bot,
};
