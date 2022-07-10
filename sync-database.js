const Sequelize = require('sequelize');

const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // Where to store all of the database contents
    storage: 'database.sqlite',
});

require('./models/tictactoe.js')(sequelize, Sequelize.DataTypes);

// Sync makes sure that the database reflects changes
sequelize.sync().then(async () => {
    console.log('Database synced.');
    sequelize.close();
}).catch(console.error);