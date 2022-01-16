"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    name: 'test',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Test command.');
    },
    handler: async (interaction) => {
        return interaction.reply({
            content: 'Did it work?',
        });
    },
};
exports.default = command;
