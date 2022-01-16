import help from "../data/help";
import { BotCommand } from './types';

const command = <BotCommand>{
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
}

export default command;