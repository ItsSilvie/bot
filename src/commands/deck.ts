import { embedDeck } from "../replies/deckEmbed";
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'deck',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Returns information about a deck on the Silvie.org v2 Deck Builder.')
      .addStringOption(option => {
        return option
          .setName('url')
          .setDescription('Paste a deck link here')
          .setRequired(true);
      });
  },
  handler: async (interaction) => {
    const topic = interaction.options.getString('url');
    let urlType: 'invalid' | 'builder' = 'invalid';
    
    if (/^https?\:\/\/build-v2\.silvie\.org\/\@\w+\/([\w-])+\/?(\d+)?$/i.test(topic)) {
      urlType = 'builder';
    }// else if (/^https?\:\/\/silv\.ee\/deck\/\w+-\w+-\w+\/?(\d+)?$/i.test(topic)) {
    //   urlType = 'shortener';
    // }

    if (urlType === 'invalid') {
      return interaction.reply({
        content: 'That link doesn\'t seem to be right. Please share a URL from the Silvie.org v2 Deck Builder (https://build-v2.silvie.org).',
        ephemeral: true,
      });
    }

    return await embedDeck(interaction, topic, urlType);
  },
}

export default command;