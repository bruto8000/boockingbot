const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  floor: Number,
  lockers: [
    [
      [
        {
          lockerPosition: Number,
          name: String,
        },
      ],
    ],
  ],
  position: Number,
});

module.exports = {
  blockSchema,
};


/// Create Blocks ///
function createBlocks(){


function createBlock({ indexFrom, parts, height, widthOfEachParth, names }) {
  return new Array(parts).fill(0).map((el, idx_1, self_1) => {
    return new Array(height).fill(0).map((el, idx_2, self_2) => {
      return new Array(widthOfEachParth).fill(0).map((el, idx_3, self_3) => {
        if (self_2.length - 1 === idx_2) {
          if (Array.isArray(names)) {
            return { name: names.shift() };
          }
          return { name: names };
        } else {
          return {
            lockerPosition:
              idx_1 * (height * widthOfEachParth - widthOfEachParth) +
              idx_2 * widthOfEachParth +
              idx_3 +
              indexFrom,
          };
        }
      });
    });
  });
}
let floor2 = [
  createBlock({
    indexFrom: 201,
    parts: 2,
    height: 5,
    widthOfEachParth: 3,
    names: "ПМ",
  }),

  createBlock({
    indexFrom: 2001,
    parts: 2,
    height: 5,
    widthOfEachParth: 3,
    names: "ПМ",
  }),
];
let floor3 = [
  createBlock({
    indexFrom: 3001,
    parts: 3,
    height: 5,
    widthOfEachParth: 3,
    names: new Array(3)
      .fill("Обучение")
      .concat(new Array(3).fill("ИМ"))
      .concat(new Array(3).fill("SMM")),
  }),
  createBlock({
    indexFrom: 3037,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "ИМ",
  }),
  createBlock({
    indexFrom: 3049,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "Обучение",
  }),
  createBlock({
    indexFrom: 3061,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "Мониторинг",
  }),

  createBlock({
    indexFrom: 3073,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "Мониторинг",
  }),
  createBlock({
    indexFrom: 3081,
    parts: 2,
    height: 5,
    widthOfEachParth: 2,
    names: "B2C",
  }),

  createBlock({
    indexFrom: 3097,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "B2C",
  }),

  createBlock({
    indexFrom: 3105,
    parts: 2,
    height: 5,
    widthOfEachParth: 3,
    names: "B2C",
  }),

  createBlock({
    indexFrom: 3129,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "B2C",
  }).concat(
    createBlock({
      indexFrom: 3141,
      parts: 1,
      height: 5,
      widthOfEachParth: 2,
      names: "B2C",
    })
  ),

  createBlock({
    indexFrom: 3149,
    parts: 2,
    height: 5,
    widthOfEachParth: 3,
    names: "SMM",
  }),
  createBlock({
    indexFrom: 3173,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "SMM",
  }),
  createBlock({
    indexFrom: 3181,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "SMM",
  }).concat(
    createBlock({
      indexFrom: 3189,
      parts: 1,
      height: 5,
      widthOfEachParth: 3,
      names: "SMM",
    })
  ),
];
let floor4 = [
  createBlock({
    indexFrom: 4001,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "НРОСК",
  }).concat(
    createBlock({
      indexFrom: 4013,
      parts: 2,
      height: 5,
      widthOfEachParth: 2,
      names: ["НРОСК", "НРОСК", "Процедуры", "Процедуры"],
    })
  ),

  createBlock({
    indexFrom: 4029,
    parts: 2,
    height: 5,
    widthOfEachParth: 2,
    names: ["B2B", "B2B", "НРОСК", "НРОСК"],
  }),

  createBlock({
    indexFrom: 4045,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "ГКК",
  }),

  createBlock({
    indexFrom: 4057,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "ГКК",
  }),
  createBlock({
    indexFrom: 4069,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "B2B",
  }),
  createBlock({
    indexFrom: 4077,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "B2B",
  }),

  createBlock({
    indexFrom: 4085,
    parts: 3,
    height: 5,
    widthOfEachParth: 3,
    names: "B2B",
  }).concat(
    createBlock({
      indexFrom: 4121,
      parts: 1,
      height: 5,
      widthOfEachParth: 2,
      names: "B2B",
    })
  ),

  createBlock({
    indexFrom: 4129,
    parts: 2,
    height: 5,
    widthOfEachParth: 3,
    names: "ОСО",
  }),

  createBlock({
    indexFrom: 4153,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "ОСО",
  }),

  createBlock({
    indexFrom: 4165,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "ОСО",
  }),

  createBlock({
    indexFrom: 4173,
    parts: 2,
    height: 5,
    widthOfEachParth: 2,
    names: ["ОСО", "ОСО", "МИ", "МИ"],
  }),

  createBlock({
    indexFrom: 4189,
    parts: 3,
    height: 5,
    widthOfEachParth: 3,
    names: "ОСО",
  }),
  createBlock({
    indexFrom: 4225,
    parts: 1,
    height: 5,
    widthOfEachParth: 2,
    names: "ОСО",
  }),

  createBlock({
    indexFrom: 4233,
    parts: 1,
    height: 5,
    widthOfEachParth: 3,
    names: "ОСО",
  }),
  createBlock({
    indexFrom: 4245,
    parts: 3,
    height: 5,
    widthOfEachParth: 3,
    names: new Array(8).fill("ОСО").concat(["ИНФО"]),
  }),
];
let {blockModel} =  require('../models/models')

let idx = 1;
blockModel.insertMany(floor2.map((lockers,idx)=>{
    return {
        lockers,
        position: ++idx,
        floor : 2
    }
}))
blockModel.insertMany(floor3.map((lockers)=>{
    return {
        lockers,
        position: idx++,
        floor : 3
    }
}))
blockModel.insertMany(floor4.map((lockers)=>{
    return {
        lockers,
        position: idx++,
        floor : 4
    }
}))
}
// createBlocks();
