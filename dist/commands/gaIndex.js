"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const gaIndex_1 = require("../embeds/gaIndex");
const array_1 = require("../utils/array");
const sets = require("../api-data/sets.json");
const command = {
    name: 'index',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Search for a card in Grand Archive\'s Index by name and set.')
            .addStringOption(option => {
            Object.values(sets).forEach(({ name, prefix }) => {
                option.addChoice(name, prefix);
            });
            return option
                .setName('set')
                .setDescription('Which set is the card part of?')
                .setRequired(true);
        })
            .addStringOption(option => option
            .setName('card')
            .setDescription('What is the card\'s name?')
            .setRequired(true)
            .setAutocomplete(true));
    },
    handler: async (interaction) => {
        const filename = interaction.options.getString('set');
        const name = interaction.options.getString('card');
        const set = sets[filename];
        if (!filename || !set) {
            return interaction.reply({
                content: 'I can\'t find that set.',
            });
        }
        const cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${filename}.json`)));
        if (!cards) {
            return interaction.reply({
                content: 'Something went wrong, please try again!',
            });
        }
        const matches = cards.filter(entry => {
            if (entry.name.toLowerCase() === name.toLowerCase()) {
                return true;
            }
            const nameParts = entry.name.split(' ');
            return nameParts.some(namePart => namePart.substring(0, name.length).toLowerCase() === name.toLowerCase());
        });
        if (!matches.length) {
            return interaction.reply({
                content: 'I was unable to find any cards matching your request.',
            });
        }
        const allVariants = matches.reduce((output, match) => ([
            ...output,
            ...match.editions.filter(edition => edition.set.prefix === set.prefix).reduce((editionOutput, edition) => {
                return [
                    ...editionOutput,
                    ...edition.circulationTemplates.map(circulation => ([
                        match, edition, circulation
                    ]))
                ];
            }, [])
        ]), []);
        if (allVariants.length > 2) {
            return interaction.reply({
                embeds: (0, array_1.shuffleArray)(allVariants).filter((_, index) => index < 2).map(([card, edition, circulation]) => (0, gaIndex_1.default)(card, edition, circulation)),
                content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'} with ${allVariants.length} variant${allVariants.length === 1 ? '' : 's'}, but I don't want to spam chat so here are 2 of them picked at random:`,
            });
        }
        return interaction.reply({
            embeds: allVariants.map(([card, edition, circulation]) => (0, gaIndex_1.default)(card, edition, circulation)),
            content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'} with ${allVariants.length} variant${allVariants.length === 1 ? '' : 's'}:`,
        });
    },
    handleAutocomplete: async (interaction) => {
        const { options } = interaction;
        const set = options.getString('set');
        const card = options.getString('card');
        if (!set || Object.keys(sets).indexOf(set) === -1) {
            return;
        }
        const setData = await Promise.resolve().then(() => require(`../api-data/${set}.json`));
        let matchCount = 0;
        return setData.filter((entry, index) => {
            if (!card) {
                return index < 25;
            }
            if (matchCount === 25 || entry.name.toLowerCase().indexOf(card.toLowerCase()) === -1) {
                return;
            }
            matchCount += 1;
            return true;
        }).map(entry => ({
            name: entry.name,
            value: entry.name,
        }));
    }
};
exports.default = command;
