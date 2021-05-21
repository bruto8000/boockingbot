const connectionToDb = require("./mongoDB");
const mongoose = require("mongoose");
const { userSchema } = require("../schemas/user.schema");


const userModel = mongoose.model("users", userSchema);


const mailServices = require("./mail.service");

async function checkLogged(telegramId) {
  let founded = await userModel.findOne({ telegramId });
  console.log(`Founded is:`, founded);
  return founded;
}
async function sendConfirmationCode(winlogin) {
 
  let user = await userModel.findOne({ winlogin });

  console.log(`Founded is:`, user);
  if (!user) {
    return false;
  }

  console.log('MAIL TO ', winlogin)
  return true;
  let confirmCode = (Math.random() * 8999 + 1000).toFixed();

  let isSended = await mailServices.sendMail({
    winlogin: user._doc.winlogin,
    CSC: user._doc.CSC,
    subject: "Код подтверждения",
    body: `<b>Код подтверждения к системе бронирования</b><br> Уважаемый пользователь, вы получили это сообщение,
       так как пытались связать свой телеграм аккаунт с учектой. Если это так, то введите код <b>${confirmCode}</b> в телеграме.`, // html body
  });

  if (!isSended) {
    return false;
  }

  let isUpdatedUserInDb = await userModel.updateOne(
    { winlogin },
    { confirmCode }
  );
  console.log("IS SENDED", isSended);
  console.log("IS UpdatedUserInDB", isUpdatedUserInDb);

  return isSended;
}

// async function updateTelegramUser(id, updates) {
//   try { 

  
//   console.log("SERVICE:Updating", { telegramID: id }, updates);
//   let updateData = await telegramUserModel.updateOne(
//     { telegramID: id },
//      updates 
//   );

//   if(!updateData.n){
//     console.log('SERVICE:CREATING')
//     await    telegramUserModel.create({
//           winlogin: null,
//           telegramID: id,
//           isLoginConfirmed:false,
//            status: 'needLogin',
//            ...updates
//       })

//   }
// }catch (err){
//   throw new Error ('NOTGUSERTOUPDATE')
// }

//   return true;
// }

// async function getTelegramUserById(id) {


//   let tgUser = await telegramUserModel.findOne({ telegramID: id });
//   if (!tgUser) {

//    let newTgUser =  await telegramUserModel.create({
//       winlogin: null,
//       telegramID: id,
//       isLoginConfirmed: false,
//       status: "needLogin",
//     });

//     return newTgUser;
//   }
//   console.log("USER IS", tgUser);
//   return tgUser;
// }

async function getUserByWinlogin(winlogin){
  let user = await userModel.findOne({winlogin});
return user;

}

async function updateUser(winlogin, updates){
 let updateData = await userModel.updateOne({winlogin},updates);
 console.log(updateData)
 if(!updateData.n){
   throw new Error("NOUSERTOUPDATE")
 }else{
   return true;
 }



}
module.exports = {
  checkLogged,
  sendConfirmationCode,
  getUserByWinlogin,
  updateUser
};
