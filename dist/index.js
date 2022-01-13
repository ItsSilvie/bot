"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
// Subcommand handlers.
const subcommands = require("./commands");
// Create a new client instance
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
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
client.login(config_json_1.token);
