import * as path from 'path';
import { Card, IndexCard, IndexCirculation, IndexEdition } from '../data/types';
import cardEmbed from '../embeds/card';
import { shuffleArray } from '../utils/array';
import { BotCommand } from './types';
import * as sets from '../api-data/sets.json';
import indexEmbed from '../embeds/gaIndex';
import { embedCard } from '../replies/cardEmbed';
import { handleSetAutocomplete } from '../utils/commands';

const command = <BotCommand>{
  name: 'random',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Reveals a Grand Archive card at random.')
      .addStringOption(option => {
        return option
          .setName('set')
          .setDescription('Only include cards from a certain set?')
          .setRequired(false)
          .setAutocomplete(true);
      })
  },
  handler: async (interaction, client) => {
    const filename = interaction.options.getString('set');
    let set;

    if (filename) {
      set = sets[filename];

      if (!filename || !set) {
        return interaction.reply({
          content: 'I can\'t find that set.',
        });
      }
    } else {
      set = sets[shuffleArray([...Object.keys(sets)])[0]];
    }
  
    const cards = await import(path.resolve(__dirname, `../api-data/${set.prefix}.json`));

    if (!cards) {
      return interaction.reply({
        content: 'Something went wrong, please try again!',
      });
    }

    const randomCard = shuffleArray(cards)[0];

    const allVariants: [IndexCard, IndexEdition, IndexCirculation][] = [randomCard].reduce((output, match) => ([
      ...output,
      ...match.editions.filter(edition => edition.set.prefix === set.prefix).reduce((editionOutput, edition) => ([
        ...editionOutput,
        [
          match,
          edition,
          {
            uuid: 'none',
            name: 'none',
            foil: false,
            printing: false,
            population_operator: '<=',
            population: 0,
          }
        ]
      ]), [])
    ]), []);

    const [card, edition] = shuffleArray(allVariants)[0];
    return await embedCard(interaction, set.prefix, card.uuid, edition.uuid);
  },
  handleAutocomplete: async (interaction) => {
		const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'set') {
      return handleSetAutocomplete(interaction);
    }
  }
}

export default command;