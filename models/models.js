const mongoose = require('mongoose');


const { userSchema } = require("../schemas/user.schema");
const { floorSchema } = require("../schemas/floor.schema");
const { blockSchema } = require("../schemas/block.schema");
const { lockerSchema } = require("../schemas/locker.schema");
const userModel = mongoose.model("users", userSchema);
const floorModel = mongoose.model("floors", floorSchema);
const blockModel = mongoose.model("blocks", blockSchema);
const lockerModel = mongoose.model("lockers", lockerSchema);

module.exports = {
    userModel,
floorModel,
blockModel,
lockerModel
}