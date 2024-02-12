"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingReply = void 0;
const path = require("path");
const pricing_1 = require("../embeds/pricing");
const pricingReply = async (interaction, setPrefix, cardUUID, editionUUID, circulationUUID) => {
    const cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${setPrefix}.json`)));
    if (!cards) {
        return interaction.reply({
            content: 'Something went wrong, please try again!',
        });
    }
    const cardMatch = cards.find(entry => entry.uuid === cardUUID);
    if (!cardMatch) {
        return interaction.reply({
            content: 'I was unable to find any cards matching your request.',
        });
    }
    const editionMatch = cardMatch.editions.find(entry => entry.uuid === editionUUID);
    if (!editionMatch) {
        return interaction.reply({
            content: 'I was unable to find any cards matching your request.',
        });
    }
    let circulationMatch = {
        uuid: 'none',
        name: 'none',
        foil: false,
        printing: false,
        population_operator: '<=',
        population: 0,
    };
    if (circulationUUID !== 'none') {
        circulationMatch = [...editionMatch.circulationTemplates, ...editionMatch.circulations].find(entry => entry.uuid === circulationUUID);
        if (!circulationMatch) {
            return interaction.reply({
                content: 'I was unable to find any cards matching your request.',
            });
        }
    }
    const embed = await (0, pricing_1.default)(cardMatch, editionMatch, circulationMatch);
    return interaction.reply({
        embeds: [embed],
        content: `<@${interaction.member.user.id}> here you go :chart_with_upwards_trend:`,
    });
};
exports.pricingReply = pricingReply;
