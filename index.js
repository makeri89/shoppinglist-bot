require('dotenv').config()

const bot = require('./bot')
const { dbConnection } = require('./db')

const main = async () => {
  await dbConnection()
  bot.start()
}

main()