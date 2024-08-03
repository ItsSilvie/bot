"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedDeck = void 0;
const deck_1 = require("../embeds/deck");
const commands_1 = require("../utils/commands");
const embedDeck = async (interaction, url, urlType) => {
    const urlParts = url.split('/');
    let attachment = undefined;
    let embed = undefined;
    // if (urlType === 'builder') {
    const [, , , creator, deckId, revision] = urlParts;
    const queryParams = new URLSearchParams({
        creator,
        id: deckId,
    });
    if (revision) {
        queryParams.append('revision', revision);
    }
    const deckData = await fetch(`${commands_1.API_URL}/api/build/v2/deck?${queryParams.toString()}`)
        .then(res => res.json());
    if (!deckData || deckData.error) {
        return interaction.reply({
            content: 'The requested deck failed to load.',
            ephemeral: true,
        });
    }
    if (deckData.private) {
        return interaction.reply({
            content: 'Private decks cannot be shared here.',
            ephemeral: true,
        });
    }
    const deckImage = await fetch(`${commands_1.API_URL}/api/build/v2/deck/image?${queryParams.toString()}`).then(response => response.blob());
    if (!deckImage || !deckImage.size) {
        return interaction.reply({
            content: 'The requested deck preview failed to load.',
            ephemeral: true,
        });
    }
    await interaction.deferReply();
    const deckEmbedData = await (0, deck_1.default)(deckData, deckId, deckImage, revision ? Number(revision) : undefined);
    attachment = deckEmbedData.attachment;
    embed = deckEmbedData.embed;
    // }
    return interaction.editReply({
        files: [attachment],
        embeds: [embed],
        content: `<@${interaction.member.user.id}> here you go!`,
    });
};
exports.embedDeck = embedDeck;
