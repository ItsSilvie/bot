"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const command = {
    name: 'whoami',
    generator: (subcommand) => {
        return subcommand
            .setName(command.name)
            .setDescription('Link others to your Silvie.org profile.');
    },
    handler: async (interaction) => {
        const queryParams = new URLSearchParams({
            id: interaction.user.id,
        });
        try {
            const data = await (0, node_fetch_1.default)(`http://localhost:3999/api/discord/user?${queryParams.toString()}`)
                .then(res => res.json());
            if (data.error || !data.displayName) {
                return interaction.reply({
                    content: 'I could not find a Silvie.org user account that has your Discord account linked. You can link your Discord account at https://portal.silvie.org.',
                    ephemeral: true,
                });
            }
            return interaction.reply({
                content: `https://silvie.org/@${data.displayName}`,
            });
        }
        catch (e) {
            return interaction.reply({
                content: 'Something went wrong. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
exports.default = command;
