const mongoose = require("mongoose");
const lockerSchema = new mongoose.Schema({
  position: Number,
  reservations: [
    {
      winlogin: String,
      from: Date,
      to: Date,
    },
  ],
});

/// Create Lockers ///
function createLockers() {
  let lockerModel = mongoose.model("lockers", lockerSchema);
  let floor2 = new Array(24)
    .fill(0)
    .map((el, idx) => ({ position: ++idx + 200 }))
    .concat(
      new Array(24).fill(0).map((el, idx) => ({ position: ++idx + 2000 }))
    );
  let floor3 = new Array(200)
    .fill(0)
    .map((el, idx) => ({ position: ++idx + 3000 }));
  let floor4 = new Array(280)
    .fill(0)
    .map((el, idx) => ({ position: ++idx + 4000 }));
  lockerModel.insertMany(floor2.concat(floor3).concat(floor4));
}
// createLockers()

module.exports = {
  lockerSchema,
};
