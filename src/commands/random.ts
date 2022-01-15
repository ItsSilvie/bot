import * as path from 'path';
import sets from '../data/sets';
import { Card } from '../data/types';
import cardEmbed from '../embeds/card';
import { shuffleArray } from '../utils/array';
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'random',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Reveals a card at random.')
      .addStringOption(option => {
        sets.forEach(entry => {
          option.addChoice(`${entry.year} ${entry.name}`, entry.filename)
        });
  
        return option
          .setName('set')
          .setDescription('Only include cards from a certain set?')
          .setRequired(false);
      })
  },
  handler: async (interaction, client) => {
    let messages = [];

    if (interaction.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
      messages = [
        "<:wow_silvie:918934079435583519>",
        "<:shocked_silvie:918934079104245851>",
        "<:cry_silvie:918934079481712690>",
      ];
    } else {
      messages = [
        'Here you go!',
        'Check this out!',
        'Look what I found!'
      ];
    }

    const filename = interaction.options.getString('set');
    let set;

    if (filename) {
      set = sets.find(entry => entry.filename === filename);

      if (!filename || !set) {
        return interaction.reply({
          content: 'I can\'t find that set.',
        });
      }
    } else {
      set = sets[Math.floor(Math.random() * sets.length)];
    }
  
    const { default: cards } = await import(path.resolve(__dirname, `../data/sets/${set.filename}.js`)) as { default: Card[] };

    if (!cards) {
      return interaction.reply({
        content: 'Something went wrong, please try again!',
      });
    }

    const match = cards[Math.floor(Math.random() * cards.length)];

    return interaction.reply({
      embeds: [cardEmbed(match, set)],
      content: messages[Math.floor(Math.random() * messages.length)],
    });
  },
}

export default command;