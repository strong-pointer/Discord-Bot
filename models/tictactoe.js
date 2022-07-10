const sequelize = require("sequelize");

// Tablespec for tictactoe
module.exports = (sequelize, DataTypes) => {
    // Definition needs name of table first
    return sequelize.define('tictactoe', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    })
}