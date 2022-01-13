import { CardElement } from "../data/types";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'elements',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Returns all known elements.');
  },
  handler: async (interaction) => {
    const lf = new Intl.ListFormat('en');
    const values = Object.values(CardElement);

    return interaction.reply({
      content: `Grand Archive has ${values.length} elements: ${lf.format(values.map(entry => `**${entry}**`))}.`,
    });
  },
}

export default command;