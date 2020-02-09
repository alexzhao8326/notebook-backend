const Sequelize = require('sequelize')
const db = require('../config/db')
const Model = Sequelize.Model
const sequelize = new Sequelize(db.name,db.user,db.password,db.other)
module.exports = {
    sequelize,
    Sequelize,
    Model
}