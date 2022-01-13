"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../data/types");
const command = {
    name: 'supertypes',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Returns all known supertypes (classes).');
    },
    handler: async (interaction) => {
        const lf = new Intl.ListFormat('en');
        const values = Object.values(types_1.CardSupertype);
        return interaction.reply({
            content: `Grand Archive has ${values.length} supertypes (classes): ${lf.format(values.map(entry => `**${entry}**`))}.`,
        });
    }
};
exports.default = command;
