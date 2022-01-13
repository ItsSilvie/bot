import { CardSupertype } from "../data/types";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'supertypes',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Returns all known supertypes (classes).');
  },
  handler: async (interaction) => {
    const lf = new Intl.ListFormat('en');
    const values = Object.values(CardSupertype);

    return interaction.reply({
      content: `Grand Archive has ${values.length} supertypes (classes): ${lf.format(values.map(entry => `**${entry}**`))}.`,
    });
  }
}

export default command;