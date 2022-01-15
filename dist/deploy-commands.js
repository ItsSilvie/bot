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
if (process.env.GUILD_ID) {
    // For local development, stick a GUILD_ID in your .env file.
    // This is the ID of the server you want to test on.
    console.log('Skipping command cleanup (not required when running locally).');
    rest.put(v9_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}
else {
    // Cleanup old commands.
    console.log('Beginning cleanup...');
    rest.get(v9_1.Routes.applicationCommands(process.env.CLIENT_ID))
        .then((data) => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${v9_1.Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`;
            // @ts-ignore
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises).then(() => {
            console.log('Clean up complete.');
            console.log('Registering updated commands...');
            rest.put(v9_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
        });
    });
}
