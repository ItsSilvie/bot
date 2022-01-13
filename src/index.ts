import { Client, Intents } from 'discord.js';
import { token } from './config.json';

// Subcommand handlers.
import * as subcommands from './commands';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

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
client.login(token);