import { ActivityOptions, Client, Intents, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';

// Subcommand handlers.
import * as subcommands from './commands';
import { shuffleArray } from './utils/array';

// For local development, make sure the .env file is set up in the root dir.
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

const digMessages = [
	'*wants to play*',
	'*runs away from Sylidar*',
	'*looks for critters*',
	'*pretends to be Dream Fairy*',
	'*is hungry*',
	'Are we there yet?',
	'*pokes treasure chest*',
	'*roars*',
	'Will you be my friend?',
	'*hehehe*',
	'I don\'t like strangers',
	"<:wow_silvie:918934079435583519>",
	"<:shocked_silvie:918934079104245851>",
	"<:cry_silvie:918934079481712690>",
	"<:mad_silvie:985427397379776602>",
	"<:anxious_silvie:985427396444434492>"
]

client.on('ready', () => {
	client.user.setActivity('Grand Archive', {
		name: 'Grand Archive TCG',
		type: 'PLAYING',
		url: 'https://grandarchivetcg.com'
	});

	let digCount = 0;
	const channel = client.channels.cache.get('990852268045787216');

	if (!channel) {
		return;
	}

	setInterval(() => {
		const digMessage = shuffleArray([...digMessages])[0];
		digCount = digCount + 1;
		(channel as TextChannel).send(`${digMessage} *(${digCount.toLocaleString()})*`);
	}, 90000);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

	const { commandName, options } = interaction;

	if (commandName !== 'silvie') {
		return;
	}

	const subcommand = Object.values(subcommands).find(entry => entry.name === options.getSubcommand());

	if (!subcommand) {
		console.log(`Subcommand ${options.getSubcommand()} not found.`);
		return;
	}

	if (interaction.isAutocomplete()) {
		if (typeof subcommand.handleAutocomplete !== 'function') {
			return;
		}

		const response = await subcommand.handleAutocomplete(interaction, client);

		if (!response) {
			return;
		}

		interaction.respond(response);
		return;
	}
	
	await subcommand.handler(interaction, client);
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);