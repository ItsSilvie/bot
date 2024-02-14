"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const array_1 = require("../utils/array");
const sets = require("../api-data/sets.json");
const cardEmbed_1 = require("../replies/cardEmbed");
const command = {
    name: 'random',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Reveals a Grand Archive card at random.')
            .addStringOption(option => {
            [...Object.values(sets)].sort(({ name: aName }, { name: bName }) => {
                return aName < bName ? -1 : 1;
            }).forEach(({ name, prefix }) => {
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
        const cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${set.prefix}.json`)));
        if (!cards) {
            return interaction.reply({
                content: 'Something went wrong, please try again!',
            });
        }
        const randomCard = (0, array_1.shuffleArray)(cards)[0];
        const allVariants = [randomCard].reduce((output, match) => ([
            ...output,
            ...match.editions.filter(edition => edition.set.prefix === set.prefix).reduce((editionOutput, edition) => ([
                ...editionOutput,
                [
                    match,
                    edition,
                    {
                        uuid: 'none',
                        name: 'none',
                        foil: false,
                        printing: false,
                        population_operator: '<=',
                        population: 0,
                    }
                ]
            ]), [])
        ]), []);
        const [card, edition] = (0, array_1.shuffleArray)(allVariants)[0];
        return await (0, cardEmbed_1.embedCard)(interaction, set.prefix, card.uuid, edition.uuid);
    },
};
exports.default = command;
