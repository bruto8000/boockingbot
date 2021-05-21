const boockingServices = require("../services/boocking.service");
const { errors } = require("../errors/errorcodes");
const fs = require("fs");
const path = require("path");
async function getFloors(level) {
  try {
    let floors = await boockingServices.getFloors(level ? { level } : {});

    return floors.map((floor) => {
      return {
        name: `Этаж ${floor.level}`,
        description: `Блоки: ${Math.min(...floor.blocks)} ${
          floor.blocks.length > 1 ? `- ${Math.max(...floor.blocks)}` : ""
        }`,
        image: floor.imageUrl
          ? fs.readFileSync(
              path.resolve(__dirname, "../images/", floor.imageUrl)
            )
          : null,
        level: floor.level,
      };
    });
  } catch (err) {
    console.log(err);
    if (errors[err] || errors[err.message]) {
      throw new Error(errors[err] || errors[err.message]);
    } else {
      throw new Error("INVALIDERROR");
    }
  }
}

async function getBlocks(level) {
    try {
      let blocks = await boockingServices.getBlocks(level ? { level } : {});
  
      return blocks.map((block) => {
          blockLastPart = block.lockers[block.lockers.length-1]
          blockPreLastRow = blockLastPart[blockLastPart.length-2]
          blockLastLocker = blockPreLastRow[blockPreLastRow.length-1]
        return {
          name: `Блок ${block.position}`,
          description: `Локеры: ${block.lockers[0][0][0].lockerPosition}-${blockLastLocker.lockerPosition}`,
        };
      });
    } catch (err) {
      console.log(err);
      if (errors[err] || errors[err.message]) {
        throw new Error(errors[err] || errors[err.message]);
      } else {
        throw new Error("INVALIDERROR");
      }
    }
}


getBlocks(3).then(data=>{
   console.log(data)
})

module.exports = {
  getFloors,
  getBlocks
};
