"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedCard = void 0;
const path = require("path");
const gaIndex_1 = require("../embeds/gaIndex");
const embedCard = async (interaction, setPrefix, cardUUID, editionUUID, config) => {
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
            ephemeral: true,
        });
    }
    const editionMatch = cardMatch.editions.find(entry => entry.uuid === editionUUID);
    if (!editionMatch) {
        return interaction.reply({
            content: 'I was unable to find any cards matching your request.',
            ephemeral: true,
        });
    }
    const embed = await (0, gaIndex_1.default)(cardMatch, editionMatch, config);
    return interaction.reply({
        embeds: [embed],
        content: `<@${interaction.member.user.id}> here you go <:wow_silvie:918934079435583519>`,
    });
};
exports.embedCard = embedCard;
