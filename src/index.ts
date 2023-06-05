import { ActivityOptions, Client, Intents, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Subcommand handlers.
import * as subcommands from './commands';
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
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

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

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	const guildId = oldMember.guild.id;
	if (guildId !== '930860482313736222') {
		return;
	}

	const serverBoostRoleId = '1115384775834869801';
	const oldMemberHasServerBoostRole = oldMember.roles.cache.has(serverBoostRoleId);
	const newMemberHasServerBoostRole = newMember.roles.cache.has(serverBoostRoleId);

	if (oldMemberHasServerBoostRole === newMemberHasServerBoostRole) {
		return;
	}

	try {
    const queryParams = new URLSearchParams({
      id: oldMember.user.id,
			status: newMemberHasServerBoostRole ? ServerBoostStatus.Added : ServerBoostStatus.Removed,
    });
	
		await fetch(`${API_URL}/api/discord/server-boost?${queryParams.toString()}`).then(response => response.json());
	} catch (e) {
		console.log(e);
	}
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