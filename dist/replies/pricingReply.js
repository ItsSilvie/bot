"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingReply = void 0;
const path = require("path");
const sealedProducts = require("../data/tcgPlayerSealedProducts.json");
const pricing_1 = require("../embeds/pricing");
const pricing_2 = require("../commands/pricing");
const pricingReply = async (interaction, setPrefix, cardUUID, editionUUID) => {
    let cards;
    const isSealedProductsSelected = setPrefix === pricing_2.fakeSealedSet.prefix;
    if (isSealedProductsSelected) {
        cards = sealedProducts;
    }
    else {
        cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${setPrefix}.json`)));
    }
    if (!cards) {
        return interaction.reply({
            content: 'Something went wrong, please try again!',
        });
    }
    const cardMatch = cards.find(entry => entry.uuid === cardUUID || entry.productId === cardUUID);
    if (!cardMatch) {
        return interaction.reply({
            content: 'I was unable to find any cards matching your request.',
            ephemeral: true,
        });
    }
    let embed;
    if (isSealedProductsSelected) {
        embed = await (0, pricing_1.default)(cardMatch, 'SEALED');
    }
    else {
        const editionMatch = cardMatch.editions.find(entry => entry.uuid === editionUUID);
        if (!editionMatch) {
            return interaction.reply({
                content: 'I was unable to find any cards matching your request.',
                ephemeral: true,
            });
        }
        embed = await (0, pricing_1.default)(cardMatch, editionMatch);
    }
    return interaction.reply({
        embeds: [embed],
        content: `<@${interaction.member.user.id}> here you go :chart_with_upwards_trend:`,
    });
};
exports.pricingReply = pricingReply;
