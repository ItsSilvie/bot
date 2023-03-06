"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const commands_1 = require("../utils/commands");
const setCategoryMap = {
    'DOA 1st': {
        categories: [
            '1 pack',
            '6 packs',
            '24 packs',
        ],
        name: 'Dawn of Ashes First Edition',
    },
    'DOAp': {
        categories: [
            '4 packs',
            '24 packs',
        ],
        name: 'Dawn of Ashes Prelude',
    }
};
var GeneratedRarityLabel;
(function (GeneratedRarityLabel) {
    GeneratedRarityLabel["C"] = "Common";
    GeneratedRarityLabel["U"] = "Uncommon";
    GeneratedRarityLabel["R"] = "Rare";
    GeneratedRarityLabel["SR"] = "Super Rare";
    GeneratedRarityLabel["UR"] = "Ultra Rare";
    GeneratedRarityLabel["PR"] = "Promotional Rare";
    GeneratedRarityLabel["CSR"] = "Collector Super Rare";
    GeneratedRarityLabel["CUR"] = "Collector Ultra Rare";
    GeneratedRarityLabel["CPR"] = "Collector Promo Rare";
})(GeneratedRarityLabel || (GeneratedRarityLabel = {}));
const command = {
    name: 'simulator',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('simulator.silvie.org, right here on Discord.')
            .addStringOption(option => {
            Object.entries(setCategoryMap).forEach(([key, { name }]) => {
                option.addChoice(name, key);
            });
            return option
                .setName('set')
                .setDescription('Which set is the card part of?')
                .setRequired(true);
        })
            .addStringOption(option => option
            .setName('category')
            .setDescription('What is the card\'s name?')
            .setRequired(true)
            .setAutocomplete(true));
    },
    handler: async (interaction) => {
        const setPrefix = interaction.options.getString('set');
        const category = interaction.options.getString('category');
        const setMatch = setCategoryMap[setPrefix];
        if (!setMatch) {
            return interaction.reply({
                content: 'I can\'t find that set.',
                ephemeral: true,
            });
        }
        if (!category || !setMatch.categories.includes(category)) {
            return interaction.reply({
                content: 'I can\'t find that category.',
                ephemeral: true,
            });
        }
        const userId = interaction.user.id;
        const packCountString = category.replace(/ packs?/, '');
        const queryParams = new URLSearchParams({
            category: packCountString,
            id: userId,
            prefix: setPrefix,
        });
        try {
            const data = await (0, node_fetch_1.default)(`http://localhost:3999/api/discord/simulator/open?${queryParams.toString()}`)
                .then(res => res.json());
            if (!data) {
                return interaction.reply({
                    content: 'Something went wrong. Please try again later.',
                    ephemeral: true,
                });
            }
            if (data.error === 'silvie/unauthenticated') {
                return interaction.reply({
                    content: commands_1.unauthenticatedMessage,
                    ephemeral: true,
                });
            }
            if (data.error === 'silvie/too-many-requests') {
                const { cooldown, isPatreonSupporter, } = data.message;
                const remainingTime = Number(new Date(cooldown)) - Date.now();
                const remainingTimeObj = {};
                if ((remainingTime / 1000 / 60) < 1) {
                    const seconds = Math.ceil(remainingTime / 1000);
                    remainingTimeObj.value = seconds;
                    remainingTimeObj.descriptor = seconds === 1 ? 'second' : 'seconds';
                }
                else {
                    const minutes = Math.round(remainingTime / 1000 / 60);
                    remainingTimeObj.value = minutes;
                    remainingTimeObj.descriptor = minutes === 1 ? 'minute' : 'minutes';
                }
                const patreonString = isPatreonSupporter ? '' : '\nYou can reduce the cooldown between pack openings by supporting Silvie on Patreon at https://patreon.com/silvie.';
                return interaction.reply({
                    content: `You need to wait another ${remainingTimeObj.value} ${remainingTimeObj.descriptor} before you can attempt this category again.${patreonString}`,
                    ephemeral: true,
                });
            }
            if (data.error) {
                return interaction.reply({
                    content: data.message ?? data.error,
                    ephemeral: true,
                });
            }
            if (!data.breakdown) {
                return interaction.reply({
                    content: 'An unknown error occurred.',
                    ephemeral: true,
                });
            }
            const { foils, rarities, } = data.breakdown;
            const raritiesString = rarities.map(([statKey, { count, }], index, arr) => (`${count} ${GeneratedRarityLabel[statKey]}${count === 1 ? '' : 's'}${index < arr.length - 2 ? ', ' : ''}${index === arr.length - 2 ? ' and ' : ''}`)).join('');
            const foilsString = foils.length ? (`– including *${foils.length} foil${foils.length === 1 ? '' : 's'}* –`) : '';
            const personalScoreString = (() => {
                if (!data.pb || !data.pw) {
                    return 'You\'ve set their first score for this category. <:wow_silvie:918934079435583519>';
                }
                if (data.score > data.pb) {
                    return `You beat your previous personal best by ${(data.score - data.pb).toLocaleString()}. <:wow_silvie:918934079435583519>`;
                }
                if (data.score < data.pw) {
                    return `You beat your previous personal worst by ${(data.pw - data.score).toLocaleString()}. <:cry_silvie:918934079481712690>`;
                }
                return `Your personal best is ${data.pb} and worst is ${data.pw}.`;
            })();
            return interaction.reply({
                content: `<@${userId}> you opened ${packCountString} ${setMatch.name} booster pack${packCountString === '1' ? '' : 's'} and pulled ${raritiesString}${foilsString ? ` ${foilsString}` : ''} for a total score of: **${data.score.toLocaleString()}**.
The highest scoring cards were ${data.top3String}.
${personalScoreString}`,
            });
        }
        catch (e) {
            return interaction.reply({
                content: 'Something went wrong. Please try again later.',
                ephemeral: true,
            });
        }
    },
    handleAutocomplete: async (interaction) => {
        const { options } = interaction;
        const setPrefix = options.getString('set');
        const category = options.getString('category');
        if (!setPrefix) {
            return;
        }
        const setMatch = setCategoryMap[setPrefix];
        if (!setMatch) {
            return;
        }
        let matchCount = 0;
        return setMatch.categories.filter(entry => {
            if (!category) {
                return true;
            }
            if (entry.toLowerCase().indexOf(category.toLowerCase()) === -1) {
                return;
            }
            matchCount += 1;
            return true;
        }).map(entry => ({
            name: entry,
            value: entry,
        }));
    }
};
exports.default = command;
