const { Markup } = require("telegraf");

const loginKeyboard = Markup.inlineKeyboard(
  [{ text: "Ввести другой логин", callback_data: "another_login" }],
  {
    columns: parseInt(1),
  }
).resize();

const mainKeyboard = Markup.inlineKeyboard([
  [{ text: "Посмотреть этажи", callback_data: "checkFloors" }],
  [{ text: "Мои записи", callback_data: "my_reservations" }],
]);

function makeFloorsKeyboard(floors) {
  return Markup.inlineKeyboard([
    ...floors.map((floor) => {
      return [
        { text: `${floor.name}`, callback_data: `checkBlocks_${floor.level}` },
        {
          text: `${floor.image ? "Посмотреть карту 🗺" : "Карты этажа нет."}`,
          callback_data: `${floor.image ? `getFloor_${floor.level}` : "empty"}`,
        },
      ];
    }),
    [{ text: "Вернуться назад ⬅️", callback_data: "main_scene" }],
  ]);
}
function makeCurrentFloorKeyboard(floor) {
  return Markup.inlineKeyboard([
    [
      { text: "Вернуться назад ⬅️", callback_data: "checkFloors" },
      { text: "Посмотреть блоки", callback_data: `checkBlocks_${floor.level}` },
    ],
  ]);
}
function makeBlocksKeyboard(blocks) {
  return Markup.inlineKeyboard([
    ...blocks.map((block) => {
      return [
        {
          text: `${block.name} ${block.description}  `,
          callback_data: `getBlock_${block.level}_${block.position}`,
        },
      ];
    }),
    [{ text: "Вернуться назад ⬅️", callback_data: "checkFloors" }],
  ]);
}
function makeCurrentBlockKeyboard(block) {
  return Markup.inlineKeyboard(
    block.lockers
      .map((part) => {
        return part.map((row) => {
          return row.map((locker) => {
            console.log(locker);
            return {
              text: `${locker.lockerPosition || locker.name}`,
              callback_data: `${
                locker.lockerPosition
                  ? `getLocker_${locker.lockerPosition}`
                  : "INVALIDLOCKER"
              }`,
            };
          });
        });
      })
      .reverse()
      .reduce((accum, current) => current.concat(accum), [])
      .concat([
        [
          {
            text: "Вернуться назад ⬅️",
            callback_data: `checkBlocks_${block.level}`,
          },
        ],
      ])
  );
}

module.exports = {
  makeCurrentBlockKeyboard,
  loginKeyboard,
  mainKeyboard,
  makeFloorsKeyboard,
  makeCurrentFloorKeyboard,
  makeBlocksKeyboard,
};
