const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    winlogin: String,
    telegramID: Number,
    confirmCode:String,
    CSC: String  
  });

module.exports = {
    userSchema
}