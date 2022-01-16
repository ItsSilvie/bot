"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const help_1 = require("../data/help");
const command = {
    name: 'help',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Provides help for various Grand Archive gameplay aspects.')
            .addStringOption(option => {
            help_1.default.forEach(({ name }) => {
                option.addChoice(name, name);
            });
            return option
                .setName('topic')
                .setDescription('What do you need help with?')
                .setRequired(true);
        });
    },
    handler: async (interaction) => {
        const topic = interaction.options.getString('topic');
        const match = help_1.default.find(({ name }) => name === topic);
        if (!match) {
            return interaction.reply({
                content: 'I can\'t find that help topic.',
            });
        }
        const { description, name, } = match;
        return interaction.reply({
            content: `**${name}**: ${description}`,
        });
    },
};
exports.default = command;
