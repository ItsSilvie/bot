"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const pricing_1 = require("../utils/pricing");
const pricingEmbed = async (card, edition, circulationTemplate) => {
    const { collector_number, set, } = edition;
    const pricingData = await (0, pricing_1.getPricingData)(edition.uuid, circulationTemplate.foil);
    const pricingLabel = 'TCGplayer market data';
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setURL(pricingData.data.url)
        .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}`)
        .setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]))
        .setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
        .setThumbnail(`https://img.silvie.org/web/tcgplayer-logo.png`);
    embed.addField(pricingLabel, pricingData.formattedReply);
    return embed;
};
exports.default = pricingEmbed;
