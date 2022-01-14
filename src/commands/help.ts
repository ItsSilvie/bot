import help from "../data/help";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'help',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Provides help for various game aspects.')
      .addStringOption(option => {
        help.forEach(({ name }) => {
          option.addChoice(name, name)
        })
  
        return option
          .setName('topic')
          .setDescription('What do you need help with?')
          .setRequired(true);
      });
  },
  handler: async (interaction) => {
    const topic = interaction.options.getString('topic');
    const match = help.find(({ name }) => name === topic);

    if (!match) {
      return interaction.reply({
        content: 'I can\'t find that help topic.',
      });
    }

    const {
      description,
      name,
    } = match;

    return interaction.reply({
      content: `**${name}**: ${description}`,
    });
  },
}

export default command;