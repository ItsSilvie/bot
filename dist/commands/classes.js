"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubcommand = void 0;
const types_1 = require("../data/types");
exports.default = async (interaction) => {
    const lf = new Intl.ListFormat('en');
    const values = Object.values(types_1.CardClass);
    return interaction.reply({
        content: `Grand Archive has ${values.length} classes: ${lf.format(values)}.`,
    });
};
const generateSubcommand = (subcommand) => {
    return subcommand
        .setName('classes')
        .setDescription('Returns all known classes (AKA supertypes).');
};
exports.generateSubcommand = generateSubcommand;
