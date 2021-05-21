const { Markup } = require("telegraf");

const loginKeyboard = Markup.inlineKeyboard([{ text: "Ввести другой логин", callback_data: "another_login" }], {
  columns: parseInt(1),
})
  .resize();

const mainKeyboard = Markup.inlineKeyboard(
  [
    [
      { text: "Посмотреть этажи", callback_data: "checkFloors" },
      { text: "Мои записи", callback_data: "my_reservations" },
    ],
  ],
  {
    columns: parseInt(1),
  }
)
 
function makeFloorsKeyboard(floors){
return Markup.inlineKeyboard(
  floors.map(floor=>{
    return  [{ text: `${floor.name}`, callback_data: `checkBlocks_${floor.level}` },{ text: `${floor.image ? 'Посмотреть карту 🗺' : 'Карты этажа нет.'}`, callback_data: `${floor.image ? `getFloor_${floor.level}` : 'empty'}`},]
  }))  
}
function makeCurrentFloorKeyboard(floor){
 return Markup.inlineKeyboard( [
    [
      { text: "Вернуться назад ⬅️", callback_data: "checkFloors" },
      { text: "Посмотреть блоки", callback_data: `checkBlocks_${floor.level}` },
    ],
  ])
}
function makeBlocksKeyboard(blocks){
  return Markup.inlineKeyboard(
    blocks.map(block=>{
      return  [{ text: `${block.name} ${block.description}  `, callback_data: `getBlock_${block.position}` }]
    }))  
}

module.exports = {
  loginKeyboard,
  mainKeyboard,
  makeFloorsKeyboard,
  makeCurrentFloorKeyboard,
  makeBlocksKeyboard
};
