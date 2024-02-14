"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
const node_fetch_1 = require("node-fetch");
// Subcommand handlers.
const subcommands = require("./commands");
const cardEmbed_1 = require("./replies/cardEmbed");
const pricingReply_1 = require("./replies/pricingReply");
const commands_1 = require("./utils/commands");
// Must match what is in (silvie-monorepo) /api/discord/server-boost
var ServerBoostStatus;
(function (ServerBoostStatus) {
    ServerBoostStatus["Added"] = "added";
    ServerBoostStatus["Removed"] = "removed";
})(ServerBoostStatus || (ServerBoostStatus = {}));
// For local development, make sure the .env file is set up in the root dir.
dotenv.config();
// Create a new client instance
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_PRESENCES] });
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
        await (0, node_fetch_1.default)(`${commands_1.API_URL}/api/discord/server-boost?${queryParams.toString()}`).then(response => response.json());
    }
    catch (e) {
        console.log(e);
    }
});
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const buttonId = interaction.customId;
        if (buttonId.includes('pricing-select')) {
            const parts = buttonId.replace('pricing-select --- ', '').split('~~~');
            if (parts.length !== 4) {
                return;
            }
            const [setPrefix, cardUUID, editionUUID] = parts;
            return (0, pricingReply_1.pricingReply)(interaction, setPrefix, cardUUID, editionUUID);
        }
        if (buttonId.includes('image-select')) {
            const parts = buttonId.replace('image-select --- ', '').split('~~~');
            if (parts.length !== 4) {
                return;
            }
            const [setPrefix, cardUUID, editionUUID] = parts;
            return (0, cardEmbed_1.embedCard)(interaction, setPrefix, cardUUID, editionUUID, {
                imageOnly: true,
            });
        }
        if (buttonId.includes('variant-select')) {
            const parts = buttonId.replace('variant-select --- ', '').split('~~~');
            if (parts.length !== 4) {
                return;
            }
            const [setPrefix, cardUUID, editionUUID] = parts;
            return (0, cardEmbed_1.embedCard)(interaction, setPrefix, cardUUID, editionUUID);
        }
        return;
    }
    if (!interaction.isCommand() && !interaction.isAutocomplete())
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
