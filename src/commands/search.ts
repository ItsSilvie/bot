import * as path from 'path';
import sets from '../data/sets';
import { Card } from '../data/types';
import cardEmbed from '../embeds/card';
import { shuffleArray } from '../utils/array';
import { BotCommand } from './types';

const command = <BotCommand>{
  name: 'search',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Search for a card by name and set.')
      .addStringOption(option => {
        sets.forEach(entry => {
          option.addChoice(`${entry.year} ${entry.name}`, entry.filename)
        });
  
        return option
          .setName('set')
          .setDescription('Which set is the card part of?')
          .setRequired(true);
      })
      .addStringOption(option => option.setName('card').setDescription('What is the card\'s name?').setRequired(true))
      .addStringOption(option => option.setName('number').setDescription('What is the card\'s number?').setRequired(false));
  },
  handler: async (interaction) => {
    const filename = interaction.options.getString('set');
    const name = interaction.options.getString('card');
    const number = interaction.options.getString('number');
  
    const set = sets.find(entry => entry.filename === filename);

    if (!filename || !set) {
      return interaction.reply({
        content: 'I can\'t find that set.',
      });
    }

    const { default: cards } = await import(path.resolve(__dirname, `../data/sets/${filename}.js`)) as { default: Card[] };

    if (!cards) {
      return interaction.reply({
        content: 'Something went wrong, please try again!',
      });
    }

    const matches = cards.filter(entry => entry.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);

    if (!matches.length) {
      return interaction.reply({
        content: 'I was unable to find any cards matching your request.',
      });
    }

    if (matches.length > 3) {
      return interaction.reply({
        embeds: shuffleArray(matches).filter((_, index) => index < 2).map(match => cardEmbed(match, set)),
        content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'}, but I don't want to spam chat so here are 2 of them picked at random:`,
      });
    }

    return interaction.reply({
      embeds: matches.map(match => cardEmbed(match, set)),
      content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'}:`,
    });
  },
}

export default command;