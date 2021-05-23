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
    return [];
  
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
          level: block.level,
          position: block.position,
        };
      });
    } catch (err) {
      console.log(err);
      return [];
    }
}
async function getOneBlock({
    position,
    level
}){
let blocks =   await boockingServices.getBlocks({position,level});
if(!blocks.length){
  return null;
}

let block = blocks[0].toObject();
let lockersInBlock =  block.lockers.flat(Infinity);
let lockersPositions = lockersInBlock.map(el=>el.lockerPosition).filter(el=>!!el)
let originalLockers = await boockingServices.getLockers({"position": {"$in": lockersPositions}})
if(!originalLockers.length){
  return null;
}
boockingServices.computeLockerColorsForBlock(lockersInBlock,originalLockers);

let image = await boockingServices.makeImageFromArrayOfLockers(block.lockers)
if(!image){
  throw new Error('IMAGEERROR');
}
block.image = image

// console.dir(block.lockers.map(part=>part.map(row=>row.map(locker=>({
//   position: locker.lockerPosition,
//   name: locker.name,
// })))) ,{depth: 30})
return block

}
async function getLocker(position)
{

let lockers = await boockingServices.getLockers({position});
let locker = lockers[0];

return locker;


}
// getOneBlock({
//    position : 27,level: 4
// })






module.exports = {
  getFloors,
  getBlocks,
  getOneBlock,
  getLocker
};
