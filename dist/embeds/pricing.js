"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const pricing_1 = require("../utils/pricing");
const options = require("../api-data/options.json");
const pricingEmbed = async (card, edition) => {
    const { collector_number, set, } = edition;
    const pricingData = await (0, pricing_1.getPricingData)(edition.uuid, undefined);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setURL(pricingData?.url)
        .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
        .setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]))
        .setAuthor({ name: 'TCGplayer Market Data', url: `https://tcgplayer.pxf.io/KjAXg9?u=${encodeURIComponent('https://www.tcgplayer.com/search/grand-archive/product?productLineName=grand-archive&view=grid')}` });
    if (pricingData?.nonFoil) {
        embed.addField(`Non-foil`, pricingData.nonFoil);
    }
    if (pricingData?.foil) {
        embed.addField(`Foil`, pricingData.foil);
    }
    if (pricingData?.similar) {
        if (pricingData.similar.quantity === 1) {
            // This is the only edition of this card.
            embed.addField('Insights', `This is [the only version](${pricingData.similar.url}) on TCGplayer.`);
        }
        else {
            embed.addField('Insights', `TCGplayer lists [${pricingData.similar.quantity} versions](${pricingData.similar.url}) of this card.
${pricingData.lowestPrice ? (`Cheapest: [$${pricingData.lowestPrice.price.toFixed(2)}](${pricingData.lowestPrice.url})`) : (`This one has the lowest price`)}.`);
        }
    }
    if (!pricingData?.nonFoil && !pricingData?.foil) {
        embed.addField('Pricing data unavailable', 'This card does not appear to be available on TCGplayer.');
    }
    else {
        embed.setImage(`https://img.silvie.org/web/powered-by-tcgplayer.png`);
        embed.setFooter({
            text: `${pricingData?.updated}\nAffiliate links help keep Silvie.org online.`,
        });
    }
    return embed;
};
exports.default = pricingEmbed;
