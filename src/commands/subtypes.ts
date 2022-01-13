import { CardSubtype } from "../data/types";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'subtypes',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Returns all known subtypes.');
  },
  handler: async (interaction) => {
    const lf = new Intl.ListFormat('en');
    const values = Object.values(CardSubtype);

    return interaction.reply({
      content: `Grand Archive has ${values.length} subtypes: ${lf.format(values.map(entry => `**${entry}**`))}.`,
    });
  },
}

export default command;