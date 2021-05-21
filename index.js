console.log(`
 

                    Locker Bot for Bee By Bruto


`)

const bot = require('./controllers/bot.controller')


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))