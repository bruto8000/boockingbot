const { Markup } = require("telegraf");

const loginKeyboard = Markup.inlineKeyboard(["Ввести другой логин"], {
  columns: parseInt(1),
})
  .oneTime()
  .resize();

const mainKeyboard = Markup.inlineKeyboard(
  [
    [
      { text: "Посмотреть этажи", callback_data: "check__floors" },
      { text: "Мои записи", callback_data: "my__reservations" },
    ],
  ],
  {
    columns: parseInt(1),
  }
)
  .oneTime()
  .resize();


module.exports = {
  loginKeyboard,
  mainKeyboard
};
