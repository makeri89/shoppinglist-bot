const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../db')

class Item extends Model {}

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { 
    type: DataTypes.STRING
  },
  bought: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'item'
})

Item.sync()

module.exports = Item