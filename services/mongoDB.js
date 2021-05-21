const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/lockersDB", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .catch((err) => {
      throw new Error(err);
    });

require('../schemas/block.schema')
require('../schemas/locker.schema')
require('../schemas/floor.schema')