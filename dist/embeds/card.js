"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const cardEmbed = (card, set) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${card.name}`)
        .setDescription(`**${set.year} ${set.name}** · ${card.number ?? 'Unnumbered'}`)
        .setColor((0, card_1.getEmbedColorFromElement)(card.element));
    if (card.image) {
        const imageBase = `https://img.silvie.org/sets/${encodeURIComponent(set.filename)}/`;
        const imageExtension = '.png';
        embed.setThumbnail(`${imageBase}${typeof card.image === 'string' ? encodeURIComponent(card.image) : encodeURIComponent(card.name)}${imageExtension}`);
    }
    if (card.effects) {
        embed.addField('\u200B', `${(0, card_1.getCardBody)(card)}\n\u200B`);
    }
    const costSymbol = card.costType === types_1.CardCost.Memory ? '🔵' : '🟡';
    embed.addField(`Cost ${costSymbol}`, `${card.cost}x ${card.costType.toLowerCase()}`, true);
    embed.addField('Element', card.element, true);
    embed.addField('Speed', card.speed ?? '-', true);
    embed.addField('Type', card.type, true);
    embed.addField('Supertype', card.supertype ?? '-', true);
    embed.addField('Subtype', card.subtype ?? '-', true);
    if (card.stats) {
        // @ts-ignore
        embed.addField('Attack', `${card.stats?.attack ?? '-'}`, true);
        // @ts-ignore
        embed.addField('Durability', `${card.stats?.durability ?? '-'}`, true);
        // @ts-ignore
        embed.addField('Health', `${card.stats?.health ?? '-'}`, true);
    }
    if (card.level !== undefined || card.lineage) {
        embed.addField('Level', `${card.level ?? '-'}`, true);
        embed.addField('Lineage', card.lineage ?? '-', true);
        embed.addField('\u200B', '\u200B', true);
    }
    if (card.quote) {
        embed.addField('\u200B', `*${card.quote}*\n`);
    }
    let notes = [];
    if (card.notes) {
        notes = [
            ...notes,
            ...(Array.isArray(card.notes) ? card.notes : [card.notes])
        ];
    }
    if (set.notes) {
        notes = [
            ...notes,
            ...(Array.isArray(set.notes) ? set.notes : [set.notes])
        ];
    }
    if (notes.length) {
        embed.setFooter({
            text: notes.join('\n'),
        });
    }
    return embed;
};
exports.default = cardEmbed;
