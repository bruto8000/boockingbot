const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema({
  imageUrl: String,
  floor: Number,
  blocks: [Number],
});

module.exports = {
  floorSchema,
};

/// Create Floors ///
function createFloors(){

let floorModel = mongoose.model('floors', floorSchema);
floorModel.insertMany([
    {
        
        floor:2,
         blocks: [1,2]
    },
    {
        imageUrl: './floors/floor_3.png',
        floor:3,
         blocks: new Array(12).fill(0).map((el,idx)=>++idx)
    },
    {
        imageUrl: './floors/floor_4.png',
        floor:4,
         blocks: new Array(15).fill(0).map((el,idx)=>++idx+12)
    }
])

}

// createFloors()