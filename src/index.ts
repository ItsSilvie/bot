import { ActivityOptions, Client, Intents, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Subcommand handlers.
import * as subcommands from './commands';
import { embedCard } from './replies/cardEmbed';
import { pricingReply } from './replies/pricingReply';
import { shuffleArray } from './utils/array';
import { API_URL } from './utils/commands';

// Must match what is in (silvie-monorepo) /api/discord/server-boost
enum ServerBoostStatus {
	Added = 'added',
	Removed = 'removed',
}

// For local development, make sure the .env file is set up in the root dir.
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [] });

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

client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) {
		const buttonId = interaction.customId;

		if (buttonId.includes('pricing-select')) {
			const parts = buttonId.replace('pricing-select --- ', '').split('~~~');

			if (parts.length !== 4) {
				return;
			}

			const [setPrefix, cardUUID, editionUUID] = parts;

			return pricingReply(interaction, setPrefix, cardUUID, editionUUID);
		}

		if (buttonId.includes('image-select')) {
			const parts = buttonId.replace('image-select --- ', '').split('~~~');

			if (parts.length !== 4) {
				return;
			}

			const [setPrefix, cardUUID, editionUUID] = parts;

			return embedCard(interaction, setPrefix, cardUUID, editionUUID, {
				imageOnly: true,
			});
		}

		if (buttonId.includes('variant-select')) {
			const parts = buttonId.replace('variant-select --- ', '').split('~~~');

			if (parts.length !== 4) {
				return;
			}

			const [setPrefix, cardUUID, editionUUID] = parts;

			return embedCard(interaction, setPrefix, cardUUID, editionUUID);
		}

		return;
	}

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