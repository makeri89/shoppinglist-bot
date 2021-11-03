const { Bot } = require('grammy')
const { hydrateReply, parseMode } = require('parse-mode')
const Item = require('./models/item')
const { formatItems, formatMessage } = require('./utils/format')

const bot = new Bot(process.env.BOT_TOKEN)

bot.use(hydrateReply)
bot.api.config.use(parseMode('MarkdownV2'))

const helpMessage = 'Komennot:\n\n' +
                    '/lista \\- kerron ostoslistan\n' +
                    '/clear \\- tyhjennän ostoslistan\n' +
                    '/add \\- lisää tuotteita ostoslistalle\n' +
                    '\\(erota tuotteet pilkulla\\)'

const addItems = async (data) => {
  console.log(data)
  const itemsToAdd = data.split(',')
  itemsToAdd.forEach(async (item) => {
    await Item.create({
      name: item.trim(),
      bought: false,
      added: new Date()
    })
  })
}

bot.command('lista', async (ctx) => {
  const items = await Item.findAll()
  console.log(items)
  console.log(formatItems(items))
  if (items.length === 0) {
    ctx.reply('Ostoslista on tyhjä\\!')
  } else {
    await ctx.reply(formatItems(items))
  }
})

bot.command('clear', async (ctx) => {
  await Item.destroy({
    truncate: true
  })
  ctx.reply('Ostoslista tyhjennetty')
})

bot.command('add', async (ctx) => {
  const data = ctx.match
  await addItems(data)
  ctx.reply(formatMessage('Tavarat lisätty ostoslistalle.\n/lista'))
})

bot.command('help', (ctx) => {
  ctx.reply(helpMessage)
})

bot.on('message', async (ctx) => {
  const data = ctx.message.text
  if (data !== 'l') {
    await addItems(data)
    ctx.reply(formatMessage('Tavarat lisätty ostoslistalle.\n/lista'))
  } else if (data === 'l') {
    const items = await Item.find()
    console.log(items)
    console.log(formatItems(items))
    await ctx.reply(formatItems(items))
  }
})

module.exports = bot