"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const getEmbedColorFromElement = (element) => {
    switch (element) {
        case types_1.CardElement.Arcane:
            return '#19ABC9';
        case types_1.CardElement.Crux:
            return '#C28FDD';
        case types_1.CardElement.Fire:
            return '#E3462A';
        case types_1.CardElement.Normal:
        default:
            return '#111111';
        case types_1.CardElement.Water:
            return '#5FD0F8';
        case types_1.CardElement.Wind:
            return '#117C00';
    }
};
const cardEmbed = (card, set) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${card.name}`)
        .setDescription(`This is ${card.number ?? 'an unnumbered card'} in the ${set.year} ${set.name} set.`)
        .setColor(getEmbedColorFromElement(card.element));
    embed.addField('Cost', `${card.cost} ${card.costType}`, true);
    embed.addField('Element', card.element, true);
    embed.addField('Speed', card.speed ?? '-', true);
    embed.addField('Type', card.type, true);
    embed.addField('Supertype', card.supertype ?? '-', true);
    embed.addField('Subtype', card.subtype ?? '-', true);
    // @ts-ignore
    embed.addField('Attack', `${card.stats?.attack ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Durability', `${card.stats?.durability ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Health', `${card.stats?.health ?? '-'}`, true);
    embed.addField('Level', `${card.level ?? '-'}`, true);
    embed.addField('Lineage', card.lineage ?? '-', true);
    embed.addField('\u200B', '\u200B', true);
    if (card.notes) {
        if (typeof card.notes === 'string') {
            embed.addField('Notes', card.notes);
        }
        else if (Array.isArray(card.notes) && card.notes.length) {
            embed.addField('Notes', card.notes.join('\n'));
        }
    }
    return embed;
};
exports.default = cardEmbed;
