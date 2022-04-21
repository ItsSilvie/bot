"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_html_markdown_1 = require("node-html-markdown");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const indexEmbed = (card, edition, circulationTemplate) => {
    const { collector_number, set, } = edition;
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setDescription(`**${set.name}** · ${circulationTemplate.name ? `${circulationTemplate.name} ` : ''}${collector_number ?? 'Unnumbered'}`)
        .setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]));
    embed.setThumbnail(`https://img.silvie.org/api-data/${edition.uuid}.jpg`);
    if (edition.effect || card.effect_raw) {
        embed.addField('\u200B', `${edition.effect ? node_html_markdown_1.NodeHtmlMarkdown.translate(edition.effect) : card.effect_raw}\n\u200B`);
    }
    const cardCostIsMemory = card.cost_memory !== null;
    const costSymbol = cardCostIsMemory ? '🔵' : '🟡';
    embed.addField(`Cost ${costSymbol}`, `${cardCostIsMemory ? card.cost_memory : card.cost_reserve}x ${cardCostIsMemory ? 'memory' : 'reserve'}`, true);
    embed.addField('Element', types_1.IndexCardElement[card.element] ?? '-', true);
    embed.addField('Speed', card.speed ?? '-', true);
    embed.addField('Type', card.types?.join(' ') ?? '-', true);
    embed.addField('Supertype', card.classes?.join(' ') ?? '-', true);
    embed.addField('Subtype', card.subtypes.join(' ') ?? '-', true);
    if (card.attack || card.durability || card.life) {
        // @ts-ignore
        embed.addField('Attack', `${card.attack ?? '-'}`, true);
        // @ts-ignore
        embed.addField('Durability', `${card.durability ?? '-'}`, true);
        // @ts-ignore
        embed.addField('Life ', `${card.life ?? '-'}`, true);
    }
    embed.addField('Variant', circulationTemplate.foil ? 'Foil' : '-', true);
    embed.addField('Population', `${circulationTemplate.population_operator ?? ''} ${circulationTemplate.population.toLocaleString()}` ?? '-', true);
    embed.addField('Illustrator', `${edition.illustrator ?? '-'}`, true);
    if (edition.flavor || card.flavor) {
        embed.addField('\u200B', `*${edition.flavor || card.flavor}*\n`);
    }
    embed.setFooter({
        text: 'This is from Grand Archive\'s Index Beta, available at https://index.gatcg.com.',
    });
    return embed;
};
exports.default = indexEmbed;
