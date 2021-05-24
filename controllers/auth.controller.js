const authServices = require("../services/auth.service");
const { errors } = require("../errors/errorcodes");
async function isLogged(telegramId) {
  if (!telegramId) {
    return false;
  }
  let isAuthed = await authServices.checkLogged(telegramId);
  return !!isAuthed;
}

async function sendConfirmationCode({ winlogin, tgUser }) {
  if (!winlogin) {
    return false;
  }

  let isSended = await authServices.sendConfirmationCode(winlogin);

  if (isSended) {
    tgUser.winlogin = winlogin;
    tgUser.status = 'needToConfirmLogin';
  }
  return !!isSended
}

async function confirmCode({ tgUser, code }) {
  try {

    let user = await authServices.getUserByWinlogin(tgUser.winlogin);
    if (!user) {
      throw new Error("NOUSERFORCONFIRM");
    }
    if (user.confirmCode != code) {
      throw new Error("INVALIDCONFIRMCODE");
    } else {

      tgUser.status ='logged'
      tgUser.isLoginConfirmed =true;
  
      await authServices.updateUser(user.winlogin,{
        telegramID: tgUser.id
      })
    }
  } catch (err) {

    if (!errors[err]) {
      throw new Error(err.message);
    } else {
      throw new Error("INVALIDERROR");
    }
  }
}

module.exports = {
  isLogged,
  sendConfirmationCode,
  confirmCode,
};
