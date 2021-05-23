const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");
const images = {
  floors_logo: fs.readFileSync(
    path.resolve(__dirname, "../images/floors/floors_logo.png")
  ),
  blocks_logo: fs.readFileSync(
    path.resolve(__dirname, "../images/blocks/blocks_logo.png")
  ),
};
const { errors } = require("../errors/errorcodes");

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
  // if(ctx.session.lastScene == 'main'){
  //     ctx.deleteMessage()
  // }
  // ctx.session.lastScene = 'main';
  ctx.deleteMessage();

  return ctx.reply("Выберите действие", keyboards.mainKeyboard);
  ("");
}

bot.use(async (ctx, next) => {
  ctx.replaceMessageWithPhoto = async function (...messageToTgUser) {
    let ctx = this;

    try {
      let message = await ctx.editMessageMedia(...messageToTgUser);
      return message;
    } catch (err) {
      ctx.deleteMessage();
      messageToTgUser[0] = messageToTgUser[0].media;
      let message = await ctx.replyWithPhoto(...messageToTgUser);
      return message;
    }
  };
  ctx.replaceMessageWithText = async function (...messageToTgUser) {
    let ctx = this;
    try {
      let message = await ctx.editMessageText(...messageToTgUser);
      return message;
    } catch (err) {
      ctx.deleteMessage();
      let message = await ctx.reply(...messageToTgUser);
      return message;
    }
  };

  next();
});
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
      ctx.reply(
        `Мы уже отправили код на ваш логин (${ctx.session.winlogin})`,
        keyboards.loginKeyboard
      );

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
  if (
    ["needLogin", "needToConfirmLogin"].includes(ctx.session.status) ||
    !ctx.session.status
  ) {
    ctx.session.status || (ctx.session.status = "needLogin");

    ctx.answerCbQuery("Эта функция вам недоступна", { showAlert: true });
    return;
  }

  next();
});
bot.action("checkFloors", async (ctx) => {
  let floors;
 
    floors = await boocking.getFloors();
if(!floors.length){
  ctx.answerCbQuery('Не удалось загрузить этажи.', {showAlert : true});
  return;
}
  
  await ctx.replaceMessageWithPhoto(
    {
      type: "photo",
      media: { source: images.floors_logo },
    },
    keyboards.makeFloorsKeyboard(floors)
  );


  ctx.answerCbQuery();
});
bot.action(/checkBlocks_/, async (ctx) => {
  let level = ctx.update.callback_query.data.split("_")[1];
  let blocks = await boocking.getBlocks(Number(level));
 if(!blocks.length){
   ctx.answerCbQuery('Не удлаось загрузить блоки', {showAlert:true})
 }
  let keyboard = keyboards.makeBlocksKeyboard(blocks);
  await ctx.replaceMessageWithPhoto( { type: "photo", media: { source: images.blocks_logo } }, keyboard)
  ctx.answerCbQuery();
});
bot.action("my_reservations", async (ctx) => {
await ctx.replaceMessageWithText(("Смотрите мои записи", keyboards.mainKeyboard))
  ctx.answerCbQuery();
});
bot.action("main_scene", async (ctx) => {

  await ctx.replaceMessageWithText('Выберите действие', keyboards.mainKeyboard);

  ctx.answerCbQuery();
});
bot.action(/getFloor_/, async (ctx) => {
  let level = ctx.update.callback_query.data.split("_")[1];
  let floors = await boocking.getFloors(level);
  let image = floors[0].image;
  await ctx.replaceMessageWithPhoto(  { type: "photo", media: { source: image } },
  keyboards.makeCurrentFloorKeyboard(floors[0]))
  ctx.answerCbQuery();
});
bot.action(/getBlock_\d+_\d+/, async (ctx) => {
  let level = ctx.update.callback_query.data.split("_")[1];
  let position = ctx.update.callback_query.data.split("_")[2];
  ctx.session.lastViewedBlock = {
    level,
    position
  }
  let block = await boocking.getOneBlock({
    position: Number(position),
    level: Number(level),
  });
  let keyboard = keyboards.makeCurrentBlockKeyboard(block);
  await ctx.replaceMessageWithPhoto(
    { type: "photo", media: { source: block.image } },
    keyboard
  )
  ctx.answerCbQuery();
});
bot.action(/getLocker_\d+/, async (ctx) => {
  let lockerPosition = ctx.update.callback_query.data.split("_")[1];
  let locker = await boocking.getLocker(lockerPosition);
  locker.isFree  = !locker.reservation || !locker.reservation.winlogin;
  if( !locker.isFree  && locker.reservation.winlogin == ctx.session.winlogin){
    locker.isLockerOfCurrentTgUser = true;
  }
 
  
  locker.name = `Локер ${locker.position}`
  locker.description = locker.isFree  ? 'Локер свободен' : 'Локер забронирован';
  locker.owner = locker.isFree ? '' : (locker.isLockerOfCurrentTgUser ? 'Вы забронировали этот локер' : `Локер забронирован пользователем ${locker.reservation.winlogin}`)
  let text = `${locker.name}\n${locker.description}\n${locker.owner || ''}`;
  let lastViewedBlock = ctx.session.lastViewedBlock; // Last Viewed Block нужен чтобы создать обратную ссылку на блок, так как локеры не имеют понятия к какому они блоку оносятся.
  let keyboard = keyboards.makeCurrentLockerKeyboard(locker,lastViewedBlock);

  ctx.replaceMessageWithText(text,keyboard)
  
  ctx.answerCbQuery();
});
bot.action("INVALIDLOCKER", async (ctx) => {
  ctx.answerCbQuery("Локер не существует", { showAlert: true });
});

module.exports = {
  bot,
};
