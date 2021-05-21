const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema({
  imageUrl: String,
  level: Number,
  blocks: [Number],
});

module.exports = {
  floorSchema,
};

/// Create Floors ///
function createFloors() {
let {floorModel} =  require('../models/models')
  floorModel.insertMany([
    {
      level: 2,
      blocks: [1, 2],
    },
    {
      imageUrl: "./floors/floor_3.png",
      level: 3,
      blocks: new Array(12).fill(0).map((el, idx) => ++idx),
    },
    {
      imageUrl: "./floors/floor_4.png",
      level: 4,
      blocks: new Array(15).fill(0).map((el, idx) => ++idx + 12),
    },
  ]);
}

// createFloors()
