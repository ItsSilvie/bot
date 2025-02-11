"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeSealedSet = void 0;
const path = require("path");
const sets = require("../api-data/sets.json");
const sealedProducts = require("../data/tcgPlayerSealedProducts.json");
const discord_js_1 = require("discord.js");
const options = require("../api-data/options.json");
const pricingReply_1 = require("../replies/pricingReply");
const commands_1 = require("../utils/commands");
exports.fakeSealedSet = {
    prefix: 'SEALED',
    name: 'Sealed Product (Booster Boxes, etc.)',
};
const setsWithSealedProduct = {
    ...sets,
    'SEALED': exports.fakeSealedSet,
};
const command = {
    name: 'pricing',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Get a card\'s TCGplayer pricing data.')
            .addStringOption(option => {
            return option
                .setName('set')
                .setDescription('Which set is the card part of?')
                .setRequired(true)
                .setAutocomplete(true);
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
        const set = setsWithSealedProduct[filename];
        if (!filename || !set) {
            return interaction.reply({
                content: 'I can\'t find that set.',
                ephemeral: true,
            });
        }
        let cards;
        const isSealedProductsSelected = set.prefix === exports.fakeSealedSet.prefix;
        if (isSealedProductsSelected) {
            cards = sealedProducts;
        }
        else {
            cards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${filename}.json`)));
        }
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
                ephemeral: true,
            });
        }
        if (isSealedProductsSelected) {
            return await (0, pricingReply_1.pricingReply)(interaction, set.prefix, matches[0].productId, null);
        }
        const allVariants = matches.reduce((output, match) => ([
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
        if (!allVariants.length) {
            return interaction.reply({
                content: 'I was unable to find any cards matching your request.',
                ephemeral: true,
            });
        }
        if (allVariants.length > 1) {
            const row = new discord_js_1.MessageActionRow()
                .addComponents(...allVariants.map(([card, edition, circulation]) => {
                return new discord_js_1.MessageButton()
                    .setCustomId(`pricing-select --- ${set.prefix}~~~${card.uuid}~~~${edition.uuid}~~~${circulation.uuid}`)
                    .setLabel(`${card.name} (${edition.collector_number}) [${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}]`)
                    .setStyle(1 /* PRIMARY */);
            }));
            return interaction.reply({
                content: 'I found multiple variants, which one do you want to see?',
                components: [row],
                ephemeral: true,
            });
        }
        const [card, edition] = allVariants[0];
        return await (0, pricingReply_1.pricingReply)(interaction, set.prefix, card.uuid, edition.uuid);
    },
    handleAutocomplete: async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name === 'set') {
            return (0, commands_1.handleSetAutocomplete)(interaction, setsWithSealedProduct);
        }
        const { options } = interaction;
        const set = options.getString('set');
        const card = options.getString('card');
        if (!set || Object.keys(setsWithSealedProduct).indexOf(set) === -1) {
            return;
        }
        let setData;
        if (set === exports.fakeSealedSet.prefix) {
            setData = [...sealedProducts].sort((a, b) => a.productId - b.productId);
        }
        else {
            setData = await Promise.resolve().then(() => require(`../api-data/${set}.json`));
        }
        return [...setData.filter((entry, index) => {
                if (!card) {
                    return index < 25;
                }
                if (entry.name.toLowerCase().indexOf(card.toLowerCase()) === -1) {
                    return false;
                }
                return true;
            }).map(entry => ({
                productId: entry.productId,
                name: `${entry.name}`,
                value: entry.name,
            }))].sort((a, b) => {
            if (!!a.productId) {
                return a.productId - b.productId;
            }
            return a.name < b.name ? -1 : 1;
        }).filter((entry, index) => index < 25);
    }
};
exports.default = command;
