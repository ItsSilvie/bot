import * as path from 'path';
import { BotCommand } from './types';
import indexEmbed from '../embeds/gaIndex';
import { shuffleArray } from '../utils/array';
import * as sets from '../api-data/sets.json';
import { IndexCard, IndexCirculation, IndexEdition } from '../data/types';

const command = <BotCommand>{
  name: 'index',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Search for a card in Grand Archive\'s Index Beta by name and set.')
      .addStringOption(option => {
        Object.values(sets).forEach(({ name, prefix }) => {
          option.addChoice(name, prefix)
        });
  
        return option
          .setName('set')
          .setDescription('Which set is the card part of?')
          .setRequired(true);
      })
      .addStringOption(option => option.setName('card').setDescription('What is the card\'s name?').setRequired(true));
  },
  handler: async (interaction) => {
    const filename = interaction.options.getString('set');
    const name = interaction.options.getString('card');
  
    const set = sets[filename];

    if (!filename || !set) {
      return interaction.reply({
        content: 'I can\'t find that set.',
      });
    }

    const cards = await import(path.resolve(__dirname, `../api-data/${filename}.json`));

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

    const allVariants: [IndexCard, IndexEdition, IndexCirculation][] = matches.reduce((output, match) => ([
      ...output,
      ...match.editions.filter(edition => edition.set.prefix === set.prefix).reduce((editionOutput, edition) => {
        return [
          ...editionOutput,
          ...edition.circulationTemplates.map(circulation => ([
            match, edition, circulation
          ]))
        ]
      }, [])
    ]), []);

    if (allVariants.length > 2) {
      return interaction.reply({
        embeds: shuffleArray(allVariants).filter((_, index) => index < 2).map(([card, edition, circulation]) => indexEmbed(card, edition, circulation)),
        content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'} with ${allVariants.length} variant${allVariants.length === 1 ? '' : 's'}, but I don't want to spam chat so here are 2 of them picked at random:`,
      });
    }

    return interaction.reply({
      embeds: allVariants.map(([card, edition, circulation]) => indexEmbed(card, edition, circulation)),
      content: `I found ${matches.length} card${matches.length === 1 ? '' : 's'} with ${allVariants.length} variant${allVariants.length === 1 ? '' : 's'}:`,
    });
  },
}

export default command;