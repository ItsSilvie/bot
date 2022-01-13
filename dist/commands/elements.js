"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../data/types");
const command = {
    name: 'elements',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Returns all known elements.');
    },
    handler: async (interaction) => {
        const lf = new Intl.ListFormat('en');
        const values = Object.values(types_1.CardElement);
        return interaction.reply({
            content: `Grand Archive has ${values.length} elements: ${lf.format(values.map(entry => `**${entry}**`))}.`,
        });
    },
};
exports.default = command;
