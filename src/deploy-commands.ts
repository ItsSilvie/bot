import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config.json';

// Subcommand generators.
import * as subcommands from './commands';

const main = new SlashCommandBuilder()
	.setName('silvie')
	.setDescription('Replies with card information!');

// Iterate through the subcommand generators to add them to the main command.
Object.values(subcommands)
	.sort((a, b) => a.name > b.name ? 1 : -1)
	.forEach(entry => main.addSubcommand(entry.generator));

const commands = [
	main
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);