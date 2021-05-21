const { Markup } = require("telegraf");

const loginKeyboard = Markup.inlineKeyboard([{ text: "Ввести другой логин", callback_data: "another_login" }], {
  columns: parseInt(1),
})
  .resize();

const mainKeyboard = Markup.inlineKeyboard(
  [
    [
      { text: "Посмотреть этажи", callback_data: "check_floors" },
      { text: "Мои записи", callback_data: "my_reservations" },
    ],
  ],
  {
    columns: parseInt(1),
  }
)
 
const makeFloorsKeyboard = function(floors){
return Markup.inlineKeyboard(
  floors.map(floor=>{
    return  [{ text: `${floor.name}`, callback_data: "check_floors" },{ text: `${floor.image ? 'Посмотреть карту 🗺' : 'Карты этажа нет.'}`, callback_data: `${floor.image ? `getFloorImage_${floor.level}` : 'empty'}`},]
  }))  
}
function makeCurrentFloorKeyboard(floor){
 return Markup.inlineKeyboard( [
    [
      { text: "Вернуться назад ⬅️", callback_data: "check_floors" },
      { text: "Посмотреть блоки", callback_data: `check_blocks_${floor.level}` },
    ],
  ])
}


module.exports = {
  loginKeyboard,
  mainKeyboard,
  makeFloorsKeyboard,
  makeCurrentFloorKeyboard
};
