"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
// Subcommand handlers.
const subcommands = require("./commands");
// For local development, make sure the .env file is set up in the root dir.
dotenv.config();
// Create a new client instance
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});
client.on('ready', () => {
    client.user.setActivity('Grand Archive', {
        name: 'Grand Archive TCG',
        type: 'PLAYING',
        url: 'https://grandarchivetcg.com'
    });
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const { commandName, options } = interaction;
    if (commandName !== 'silvie') {
        return;
    }
    const subcommand = Object.values(subcommands).find(entry => entry.name === options.getSubcommand());
    if (!subcommand) {
        console.log(`Subcommand ${options.getSubcommand()} not found.`);
        return;
    }
    await subcommand.handler(interaction);
});
// Login to Discord with your client's token
client.login(process.env.TOKEN);
