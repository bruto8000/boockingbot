console.log(`
 

                    Locker Bot for Bee By Bruto


`)
const connection = require('./services/mongoDB.js')
const bot = require('./controllers/bot.controller')


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))