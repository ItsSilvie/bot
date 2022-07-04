import links from "../data/links";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'links',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Returns a chosen Grand Archive URL.')
      .addStringOption(option => {
        links.forEach(({ name }) => {
          option.addChoice(name, name)
        })
  
        return option
          .setName('to')
          .setDescription('What link would you like?')
          .setRequired(true);
      });
  },
  handler: async (interaction) => {
    const topic = interaction.options.getString('to');
    const match = links.find(({ name }) => name === topic);

    if (!match) {
      return interaction.reply({
        content: 'I can\'t find that link.',
      });
    }

    const {
      url,
      name,
    } = match;

    return interaction.reply({
      content: `${name}: ${url}`,
    });
  },
}

export default command;