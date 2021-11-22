const { Bot } = require('grammy')
const { hydrateReply, parseMode } = require('parse-mode')
const Item = require('./models/item')
const { formatItems, formatMessage } = require('./utils/format')

const bot = new Bot(process.env.BOT_TOKEN)

bot.use(hydrateReply)
bot.api.config.use(parseMode('MarkdownV2'))

const helpMessage = 'Komennot:\n\n' +
                    '/lista - kerron ostoslistan\n' +
                    '/clear - tyhjennän ostoslistan\n' +
                    '/add tuote1, tuote2- lisää tuotteita\n' +
                    '/poista tuote1, tuote2 - poista tuotteita\n' +
                    '(erota useammat tuotteet pilkulla)'


const addItems = async (data) => {
  const itemsToAdd = data.split(',')
  for (let i = 0; i < itemsToAdd.length; i++) {
    const item = itemsToAdd[i]
    if (item !== '') {
      await Item.findOrCreate({
        where: {
          name: item.trim().toLowerCase()
        },
        defaults: {
          bought: false
        }
      })
    }
  }
}

const deleteItems = async (data) => {
  const itemsToDelete = data.split(',')
  for (let i = 0; i < itemsToDelete.length; i++) {
    const item = itemsToDelete[i]
    await Item.destroy({
      where: {
        name: item.trim().toLowerCase()
      }
    })
  }
}

bot.command('lista', async (ctx) => {
  const items = await Item.findAll()
  if (items.length === 0) {
    ctx.reply(formatMessage('Ostoslista on tyhjä!'))
  } else {
    ctx.reply(formatItems(items))
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

bot.command('poista', async (ctx) => {
  const data = ctx.match
  await deleteItems(data)
  ctx.reply(formatMessage('Tavara(t) poistettu!'))
})

bot.command('help', (ctx) => {
  ctx.reply(formatMessage(helpMessage))
})

bot.on('message', async (ctx) => {
  if (ctx.message.sticker) {
    ctx.reply('viitikkö olla postaamatta tarroja')
  } else {
    const data = ctx.message.text
    if (data === 'l' || data === 'L') {
      const items = await Item.findAll()
      ctx.reply(formatItems(items))
    } else {
      await addItems(data)
      ctx.reply(formatMessage('Tavarat lisätty ostoslistalle.\n/lista'))
    }
  }
})

bot.catch((error) => {
  console.error(error)
})

module.exports = bot
