"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const sets_1 = require("../data/sets");
const card_1 = require("../embeds/card");
const command = {
    name: 'random',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Reveals a card at random.')
            .addStringOption(option => {
            sets_1.default.forEach(entry => {
                option.addChoice(`${entry.year} ${entry.name}`, entry.filename);
            });
            return option
                .setName('set')
                .setDescription('Only include cards from a certain set?')
                .setRequired(false);
        });
    },
    handler: async (interaction, client) => {
        let messages = [];
        if (interaction.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
            messages = [
                "<:wow_silvie:918934079435583519>",
                "<:shocked_silvie:918934079104245851>",
                "<:cry_silvie:918934079481712690>",
            ];
        }
        else {
            messages = [
                'Here you go!',
                'Check this out!',
                'Look what I found!'
            ];
        }
        const filename = interaction.options.getString('set');
        let set;
        if (filename) {
            set = sets_1.default.find(entry => entry.filename === filename);
            if (!filename || !set) {
                return interaction.reply({
                    content: 'I can\'t find that set.',
                });
            }
        }
        else {
            set = sets_1.default[Math.floor(Math.random() * sets_1.default.length)];
        }
        const { default: cards } = await Promise.resolve().then(() => require(path.resolve(__dirname, `../data/sets/${set.filename}.js`)));
        if (!cards) {
            return interaction.reply({
                content: 'Something went wrong, please try again!',
            });
        }
        const match = cards[Math.floor(Math.random() * cards.length)];
        return interaction.reply({
            embeds: [(0, card_1.default)(match, set)],
            content: messages[Math.floor(Math.random() * messages.length)],
        });
    },
};
exports.default = command;
