const connectionToDb = require("./mongoDB");
const mongoose = require("mongoose");
const nodeHtmlToImage = require('node-html-to-image')
const { userModel } = require("../models/models");
const { floorModel } = require("../models/models");
const { blockModel } = require("../models/models");
const { lockerModel } = require("../models/models");




async function getFloors(filter = {}){

let floors = await floorModel.find(filter)
return floors
}
async function getBlocks(filter = {}){
let blocks = await blockModel.find(filter)
return blocks
}
async function getLockers(filter = {}){
    let lockers = await lockerModel.find(filter)
return lockers.map(locker=>locker.toObject())
}
async function makeImageFromArrayOfLockers(arrayOfLockers){
    
 let jsonnedArrayOfLockers = JSON.stringify(arrayOfLockers)

 let image = await nodeHtmlToImage({
  html: `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Document</title>
  </head>

  <body>
    <style>
      .part {
        border: 4px solid rgba(155, 155, 155, 0.528);
        display: block;
        flex-basis: 0;
        flex-grow: 1;
        flex-shrink: 1;
        margin: 1rem !important;
      }

      .row {
        display: flex;
      }

      .locker {
        width : 40px;
        padding: 1.5rem;
        border: 2px solid black;
      }

      .main {
        display: flex;
        text-align: center !important;
      }
    </style>

    <div id="main" class="main"></div>
    <script>
      let deepArrayOfLockers = JSON.parse( '${jsonnedArrayOfLockers}' )
      let mainElement = document.getElementById("main");
      let widthOfBody = deepArrayOfLockers.length * 40;
      let lockersForWidth = [];
      for (let i = 0; i < deepArrayOfLockers.length; i++) {
        let partElement = document.createElement("div");
        partElement.classList.add("part");
        for (let j = 0; j < deepArrayOfLockers[i].length; j++) {
          let rowElement = document.createElement("div");
          rowElement.classList.add("row");
          for (let k = 0; k < deepArrayOfLockers[i][j].length; k++) {
            let lockerElement = document.createElement("div");
            j === 0 && lockersForWidth.push(lockerElement);
            lockerElement.classList.add("locker");
            lockerElement.innerText =
              deepArrayOfLockers[i][j][k].lockerPosition || deepArrayOfLockers[i][j][k].name;
              lockerElement.style.color = deepArrayOfLockers[i][j][k].color;
            rowElement.appendChild(lockerElement);
          }
          partElement.appendChild(rowElement);
        }
        mainElement.appendChild(partElement);
      }

      widthOfBody += lockersForWidth.reduce(
        (accum, current) => current.getBoundingClientRect().width + accum,
        0
      );
      document.body.style.width = widthOfBody + "px";
    </script>
  </body>
</html>
`
});
return image;
}
function computeLockerColorsForBlock(lockersInBlock, originalLockers){

    lockersInBlock.forEach((lockerInBlock)=>{
   
      let originalLocker = originalLockers.find(locker=>locker.position == lockerInBlock.lockerPosition);
       if(!originalLocker){
        lockerInBlock.color = 'orange';
         return;
       }
       if(originalLocker.reservation && originalLocker.reservation.winlogin){
         lockerInBlock.color = 'red';
       }else{
        lockerInBlock.color = 'green';
       }
    })
       return true;
  }
module.exports = {
    getFloors,
    getBlocks,
    getLockers,
    makeImageFromArrayOfLockers,
    computeLockerColorsForBlock
}

