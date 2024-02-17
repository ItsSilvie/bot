"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dayjs = require("dayjs");
const relativeTimePlugin = require("dayjs/plugin/relativeTime");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);
dayjs.extend(relativeTimePlugin);
const deckEmbed = async (deckData, deckId, image, revision) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(deckData.name)
        .setURL(`https://build-v2.silvie.org/@${encodeURIComponent(deckData.creator.displayName)}/${deckId}${revision ? `/${revision}` : ''}`)
        .setDescription(`Last updated: ${dayjs(deckData.updated ?? deckData.created).format('Do MMMM YYYY')}.`)
        .setAuthor({ name: `@${deckData.creator.displayName} on the Silvie.org Deck Builder`, url: `https://build-v2.silvie.org/@${encodeURIComponent(deckData.creator.displayName)}` });
    const queryParams = new URLSearchParams({
        creator: `@${deckData.creator.displayName}`,
        id: deckId,
    });
    if (revision) {
        queryParams.append('revision', `${revision}`);
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    const attachment = new discord_js_1.MessageAttachment(buffer, 'img.png');
    embed.setImage(`attachment://img.png`);
    embed.setFooter({
        text: 'This command is mostly a work in progress.',
    });
    return {
        attachment,
        embed,
    };
};
exports.default = deckEmbed;
