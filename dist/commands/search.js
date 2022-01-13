"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const sets_1 = require("../data/sets");
const card_1 = require("../embeds/card");
const command = {
    name: 'search',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Search for a card by name and set.')
            .addStringOption(option => {
            sets_1.default.forEach(entry => {
                option.addChoice(`${entry.year} ${entry.name}`, entry.filename);
            });
            return option
                .setName('set')
                .setDescription('Which set is the card part of?')
                .setRequired(true);
        })
            .addStringOption(option => option.setName('card').setDescription('What is the card\'s name?').setRequired(true))
            .addStringOption(option => option.setName('number').setDescription('What is the card\'s number?').setRequired(false));
    },
    handler: async (interaction) => {
        console.log(interaction);
        const filename = interaction.options.getString('set');
        const name = interaction.options.getString('card');
        const number = interaction.options.getString('number');
        const set = sets_1.default.find(entry => entry.filename === filename);
        if (!filename || !set) {
            return interaction.reply({
                content: 'I can\'t find that set.',
            });
        }
        const { default: cards } = await Promise.resolve().then(() => require(path.resolve(__dirname, `../data/sets/${filename}.js`)));
        if (!cards) {
            return interaction.reply({
                content: 'Something went wrong, please try again!',
            });
        }
        const matches = cards.filter(entry => entry.name.indexOf(name) !== -1);
        if (!matches.length) {
            return interaction.reply({
                content: 'I was unable to find any cards matching your request.',
            });
        }
        return interaction.reply({
            embeds: matches.map(match => (0, card_1.default)(match, set)),
            content: `I found ${matches.length} cards:`,
        });
    },
};
exports.default = command;
