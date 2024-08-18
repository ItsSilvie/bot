import * as path from 'path';
import { BotCommand } from './types';
import * as sets from '../api-data/sets.json';
import * as sealedProducts from '../data/tcgPlayerSealedProducts.json';
import { IndexCard, IndexCirculation, IndexEdition } from '../data/types';
import { MessageActionRow, MessageButton } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import * as options from '../api-data/options.json';
import { pricingReply } from '../replies/pricingReply';
import { handleSetAutocomplete } from '../utils/commands';

export const fakeSealedSet = {
  prefix: 'SEALED',
  name: 'Sealed Product (Booster Boxes, etc.)',
}

const setsWithSealedProduct = {
  ...sets,
  'SEALED': fakeSealedSet,
}

const command = <BotCommand>{
  name: 'pricing',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Get a card\'s TCGplayer pricing data.')
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
  
    const set = setsWithSealedProduct[filename];

    if (!filename || !set) {
      return interaction.reply({
        content: 'I can\'t find that set.',
        ephemeral: true,
      });
    }

    let cards;

    const isSealedProductsSelected = set.prefix === fakeSealedSet.prefix;

    if (isSealedProductsSelected) {
      cards = sealedProducts;
    } else {
      cards = await import(path.resolve(__dirname, `../api-data/${filename}.json`));
    }

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

    if (isSealedProductsSelected) {
      return await pricingReply(interaction, set.prefix, matches[0].productId, null);
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
            .setCustomId(`pricing-select --- ${set.prefix}~~~${card.uuid}~~~${edition.uuid}~~~${circulation.uuid}`)
            .setLabel(`${card.name} (${edition.collector_number}) [${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}]`)
            .setStyle(MessageButtonStyles.PRIMARY)
        }));

      return interaction.reply({
        content: 'I found multiple variants, which one do you want to see?',
        components: [row],
        ephemeral: true,
      })
    }

    const [card, edition] = allVariants[0];
    return await pricingReply(interaction, set.prefix, card.uuid, edition.uuid);
  },
  handleAutocomplete: async (interaction) => {
		const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'set') {
      return handleSetAutocomplete(interaction, setsWithSealedProduct);
    }
    
    const { options } = interaction;
    const set = options.getString('set');
    const card = options.getString('card');

    if (!set || Object.keys(setsWithSealedProduct).indexOf(set) === -1) {
      return;
    }
  
    let setData;

    if (set === fakeSealedSet.prefix) {
      setData = [...sealedProducts].sort((a, b) => a.productId - b.productId);
    } else {
      setData = await import(`../api-data/${set}.json`);
    }
    let matchCount = 0;

    return [...setData.filter((entry, index) => {
      if (!card) {
        return index < 25;
      }

      if (matchCount === 25 || entry.name.toLowerCase().indexOf(card.toLowerCase()) === -1) {
        return;
      }

      matchCount += 1;
      return true;
    }).map(entry => ({
      productId: entry.productId,
      name: `${entry.name}`,
      value: entry.name,
    }))].sort((a, b) => {
      if (!!a.productId) {
        return a.productId - b.productId;
      }

      return a.name < b.name ? -1 : 1;
    });
  }
}

export default command;