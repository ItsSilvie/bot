"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const dotenv = require("dotenv");
// Subcommand generators.
const subcommands = require("./commands");
// For local development, make sure the .env file is set up in the root dir.
dotenv.config();
const main = new builders_1.SlashCommandBuilder()
    .setName('silvie')
    .setDescription('Replies with card information!');
// Iterate through the subcommand generators to add them to the main command.
Object.values(subcommands)
    .sort((a, b) => a.name > b.name ? 1 : -1)
    .forEach(entry => main.addSubcommand(entry.generator));
const commands = [
    main
].map(command => command.toJSON());
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.TOKEN);
rest.put(v9_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
