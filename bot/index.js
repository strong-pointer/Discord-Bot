const { Client, Intents, Emoji, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('../config.json');
const { TicTacToe } = require('./databaseObjects.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
})

client.on('messageCreate', (message) => {
    if (message.author.id === client.user.id) return;

    if (message.content === "ping") {
        message.reply("pong");
    }
})

/* Tic Tac Toe */
let EMPTY = Symbol("empty");
let PLAYER = Symbol("player");
let BOT = Symbol("bot");

let tictactoe_state;

function MakeGrid() {
    components = [];

    for (let row = 0; row < 3; row++) {
        actionRow = new MessageActionRow();

        for (let col = 0; col < 3; col++) {
            messageButton = new MessageButton()
                .setCustomId('tictactoe_' + row + '_' + col)

            switch(tictactoe_state[row][col]) {
                case EMPTY:
                    messageButton
                        .setLabel(' ')
                        .setStyle('SECONDARY');
                    break;
                case PLAYER:
                    messageButton
                        .setLabel('X')
                        // Changes button to blue
                        .setStyle('PRIMARY');
                    break;
                case BOT:
                    messageButton
                        .setLabel('O')
                        // Changes button to red
                        .setStyle('DANGER');
                    break;
            }
            
                
            actionRow.addComponents(messageButton);
        }
        components.push(actionRow);
    }
    
    return components;
}

function GetRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function IsDraw() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (tictactoe_state[row][col] === EMPTY) return false;
        }
    }

    return true;
}

// Finds a winner
function IsGameOver() {
    
    for (let i = 0; i < 3; i++) {
        // Horizontal check
        if (tictactoe_state[i][0] == tictactoe_state[i][1] && tictactoe_state[i][1] == tictactoe_state[i][2] && tictactoe_state[i][2] != EMPTY) {
            return true;
        }
        //Vertical check
        if (tictactoe_state[0][i] == tictactoe_state[1][i] && tictactoe_state[1][i] == tictactoe_state[2][i] && tictactoe_state[2][i] != EMPTY) {
            return true;
        }
    }

    // Diagonal check
    if (tictactoe_state[1][1] != EMPTY) {
        if ((tictactoe_state[0][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[2][2]) || 
            (tictactoe_state[2][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2])) {
            return true;
        }
    }

    return false;
}

// Button clicked by user denoted by isButton()
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('tictactoe')) return;

    if (IsGameOver()) {
        interaction.update({
            components: MakeGrid()
        })
        return;
    }

    // User choice
    let parsedFields = interaction.customId.split("_");
    let row = parsedFields[1];
    let col = parsedFields[2];

    if (tictactoe_state[row][col] != EMPTY) {
        interaction.update({
            content: "You can't select a non-empty position!",
            components: MakeGrid()
        })
        return;
    }

    tictactoe_state[row][col] = PLAYER;

    if (IsGameOver()) {
        // Attempts to find the user within the database
        let user = await TicTacToe.findOne({
            where: {
                user_id: interaction.user.id
            }
        });
        // If the user is not found in the database
        //      then, the new user is created within the database
        if (!user) {
            user = await TicTacToe.create({
                user_id: interaction.user.id
            });
        }
        await user.increment('score');

        interaction.update({
            content: "You won the game of tic-tac-toe! You now have won " + (user.get('score') + 1) + " time(s).",
            components: []
        })
        return;
    }
    if (IsDraw()) {
        interaction.update({
            content: "The game resulted in a draw!",
            components: []
        })
        return;
    }
    
    // Bot "choice"
    let botRow;
    let botCol;
    // Loop until valid space is chosen by bot
    do {
        botRow = GetRandomInt(3);
        botCol = GetRandomInt(3);
    } while (tictactoe_state[botRow][botCol] != EMPTY);

    tictactoe_state[botRow][botCol] = BOT;

    if (IsGameOver()) {
        interaction.update({
            content: "You lost the game of tic-tac-toe!",
            components: MakeGrid()
        })
        return;
    }
    if (IsDraw()) {
        interaction.update({
            content: "The game resulted in a draw!",
            components: []
        })
        return;
    }

    // Only 1 update allowed per interaction
    interaction.update({
        content: "Playing a game of tic-tac-toe!",
        components: MakeGrid()
    })
})

// Actual Slash command denoted by isCommand
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'tictactoe') {
        tictactoe_state = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ]

        await interaction.reply({ content: 'Playing a game of tic-tac-toe!', components: MakeGrid() });
    }
})

/* */


client.login(token);