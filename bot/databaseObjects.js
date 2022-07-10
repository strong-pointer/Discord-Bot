const Sequelize = require('sequelize');

const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // Where to store all of the database contents
    storage: 'database.sqlite',
});

const TicTacToe = require('./models/tictactoe.js')(sequelize, Sequelize.DataTypes);

module.exports = {
    TicTacToe
};