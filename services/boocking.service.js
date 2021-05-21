const connectionToDb = require("./mongoDB");
const mongoose = require("mongoose");
const { userModel } = require("../models/models");
const { floorModel } = require("../models/models");
const { blockModel } = require("../models/models");
const { lockerModel } = require("../models/models");





async function getFloors(filter = {}){

let floors = await floorModel.find(filter)
return floors
}
async function getBlocks(filter = {}){

    let floors = await blockModel.find(filter)
    return floors
    }



module.exports = {
    getFloors,
    getBlocks
}

