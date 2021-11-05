const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false,
})

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection to database establishes successfully.')
  } catch (error) {
    console.error('Connection to database failed:', error)
  }
}

module.exports= {
  sequelize,
  dbConnection
}