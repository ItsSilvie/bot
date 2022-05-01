"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const array_1 = require("../utils/array");
const sets = require("../api-data/sets.json");
const gaIndex_1 = require("../embeds/gaIndex");
const command = {
    name: 'random',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Reveals a Grand Archive card at random.')
            .addStringOption(option => {
            Object.values(sets).forEach(({ name, prefix }) => {
                option.addChoice(name, prefix);
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
            set = sets[filename];
            if (!filename || !set) {
                return interaction.reply({
                    content: 'I can\'t find that set.',
                });
            }
        }
        else {
            set = sets[(0, array_1.shuffleArray)([...Object.keys(sets)])[0]];
        }
        console.log(set);
        const cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${set.prefix}.json`)));
        if (!cards) {
            return interaction.reply({
                content: 'Something went wrong, please try again!',
            });
        }
        const match = (0, array_1.shuffleArray)([...cards])[0];
        const edition = (0, array_1.shuffleArray)([...match.editions.filter(edition => edition.set.prefix === set.prefix)])[0];
        const circulation = (0, array_1.shuffleArray)([...edition.circulationTemplates])[0];
        return interaction.reply({
            embeds: [(0, gaIndex_1.default)(match, edition, circulation)],
            content: (0, array_1.shuffleArray)([...messages])[0],
        });
    },
};
exports.default = command;
