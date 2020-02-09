const { sequelize, Model, Sequelize } = require('../util/sequelize')

class User extends Model {}
User.init(
    {
        account: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    { sequelize, modelName: 'user' }
)

module.exports = User
