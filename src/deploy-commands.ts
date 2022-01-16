import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommand } from 'discord.js';
import * as dotenv from 'dotenv';

// Subcommand generators.
import * as subcommands from './commands';

// For local development, make sure the .env file is set up in the root dir.
dotenv.config();

const main = new SlashCommandBuilder()
	.setName('silvie')
	.setDescription('Replies with card information!');

console.log(new Date());

// Iterate through the subcommand generators to add them to the main command.
Object.values(subcommands)
	.sort((a, b) => a.name > b.name ? 1 : -1)
	.forEach(entry => main.addSubcommand(entry.generator));

console.log(`Generating ${Object.values(subcommands).length} subcommands...`);
Object.values(subcommands).forEach(entry => console.log(entry.name));


const commands = [
	main
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

if (process.env.GUILD_ID) {
	// For local development, stick a GUILD_ID in your .env file.
	// This is the ID of the server you want to test on.
	console.log('Skipping command cleanup (not required when running locally).')
	rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
} else {
	// Cleanup old commands.
	rest.get(Routes.applicationCommands(process.env.CLIENT_ID))
		.then((data: ApplicationCommand[]) => {
				const promises = [];
				for (const command of data) {
					promises.push(rest.delete(`${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`));
				}

				return Promise.all(promises).then(() => {
					console.log('Clean up complete.');
					console.log('Registering updated commands...')

					rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
						.then(() => console.log('Successfully registered application commands.'))
						.catch(console.error);
				});
		});
}
