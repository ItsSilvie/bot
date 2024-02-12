"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const pricing_1 = require("../utils/pricing");
const options = require("../api-data/options.json");
const pricingEmbed = async (card, edition, circulationTemplate) => {
    const { collector_number, set, } = edition;
    const pricingData = await (0, pricing_1.getPricingData)(edition.uuid, undefined);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setURL(pricingData.url)
        .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
        .setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]))
        .setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
        .setThumbnail(`https://img.silvie.org/web/tcgplayer-logo.png`);
    if (pricingData.nonFoil) {
        embed.addField(`Non-foil`, pricingData.nonFoil);
    }
    if (pricingData.foil) {
        embed.addField(`Foil`, pricingData.foil);
    }
    return embed;
};
exports.default = pricingEmbed;
