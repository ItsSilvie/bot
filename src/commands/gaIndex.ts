import * as path from 'path';
import { BotCommand } from './types';
import * as sets from '../api-data/sets.json';
import { IndexCard, IndexCirculation, IndexEdition } from '../data/types';
import { MessageActionRow, MessageButton } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import * as options from '../api-data/options.json';
import { embedCard } from '../replies/cardEmbed';
import { handleSetAutocomplete } from '../utils/commands';

const command = <BotCommand>{
  name: 'index',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Search for a card in Grand Archive\'s Index by name and set.')
      .addStringOption(option => {
        return option
          .setName('set')
          .setDescription('Which set is the card part of?')
          .setRequired(true)
          .setAutocomplete(true);
      })
      .addStringOption(option => 
        option
          .setName('card')
          .setDescription('What is the card\'s name?')
          .setRequired(true)
          .setAutocomplete(true)
      );
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

    const matches = cards.filter(entry => {
      if (entry.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }

      const nameParts = entry.name.split(' ');
      return nameParts.some(namePart => namePart.substring(0, name.length).toLowerCase() === name.toLowerCase())
    });

    if (!matches.length) {
      return interaction.reply({
        content: 'I was unable to find any cards matching your request.',
        ephemeral: true,
      });
    }

    const allVariants: [IndexCard, IndexEdition, IndexCirculation][] = matches.reduce((output, match) => ([
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

    if (!allVariants.length) {
      return interaction.reply({
        content: 'I was unable to find any cards matching your request.',
        ephemeral: true,
      });
    }

    if (allVariants.length > 1) {
      const row = new MessageActionRow()
        .addComponents(...allVariants.map(([card, edition, circulation]) => {
          return new MessageButton()
            .setCustomId(`variant-select --- ${set.prefix}~~~${card.uuid}~~~${edition.uuid}~~~${circulation.uuid}`)
            .setLabel(`${card.name} (${edition.collector_number}) [${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}]`)
            .setStyle(MessageButtonStyles.PRIMARY)
        }));

      return interaction.reply({
        content: 'I found multiple variants, which one do you want to see?',
        components: [row],
        ephemeral: true,
      })
    }

    const [card, edition, circulation] = allVariants[0];
    return await embedCard(interaction, set.prefix, card.uuid, edition.uuid);
  },
  handleAutocomplete: async (interaction) => {
		const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'set') {
      return handleSetAutocomplete(interaction);
    }

    const { options } = interaction;
    const set = options.getString('set');
    const card = options.getString('card');

    if (!set || Object.keys(sets).indexOf(set) === -1) {
      return;
    }
  
    const setData = await import(`../api-data/${set}.json`);

    return [...setData.filter((entry, index) => {
      if (!card) {
        return index < 25;
      }

      if (entry.name.toLowerCase().indexOf(card.toLowerCase()) === -1) {
        return false;
      }

      return true;
    }).map(entry => ({
      name: entry.name,
      value: entry.name,
    }))].sort(({ name: aName }, { name: bName }) => {
      return aName < bName ? -1 : 1;
    }).filter((entry, index) => index < 25);
  }
}

export default command;