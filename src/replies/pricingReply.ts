import * as path from 'path';
import * as sealedProducts from '../data/tcgPlayerSealedProducts.json';
import { ButtonInteraction, CommandInteraction } from "discord.js";
import pricingEmbed from '../embeds/pricing';
import { fakeSealedSet } from '../commands/pricing';

export const pricingReply = async (interaction: ButtonInteraction | CommandInteraction, setPrefix: string, cardUUID: string, editionUUID: string | null) => {
  let cards;

  const isSealedProductsSelected = setPrefix === fakeSealedSet.prefix;

  if (isSealedProductsSelected) {
    cards = sealedProducts;
  } else {
    cards = await import(path.resolve(__dirname, `../api-data/${setPrefix}.json`));
  }

  if (!cards) {
    return interaction.reply({
      content: 'Something went wrong, please try again!',
    });
  }

  const cardMatch = cards.find(entry => entry.uuid === cardUUID || entry.productId === cardUUID);

  if (!cardMatch) {
    return interaction.reply({
      content: 'I was unable to find any cards matching your request.',
      ephemeral: true,
    });
  }

  let embed;

  if (isSealedProductsSelected) {
    embed = await pricingEmbed(cardMatch, 'SEALED');
  } else {
    const editionMatch = cardMatch.editions.find(entry => entry.uuid === editionUUID);
  
    if (!editionMatch) {
      return interaction.reply({
        content: 'I was unable to find any cards matching your request.',
        ephemeral: true,
      });
    }
  
    embed = await pricingEmbed(cardMatch, editionMatch);
  }

  return interaction.reply({
    embeds: [embed],
    content: `<@${interaction.member.user.id}> here you go :chart_with_upwards_trend:`,
  });
}