import * as path from 'path';
import { ButtonInteraction, CommandInteraction } from "discord.js";
import indexEmbed from '../embeds/gaIndex';

export const embedCard = async (interaction: ButtonInteraction | CommandInteraction, setPrefix: string, cardUUID: string, editionUUID: string, circulationUUID: string) => {
  const cards = await import(path.resolve(__dirname, `../api-data/${setPrefix}.json`));

  if (!cards) {
    return interaction.reply({
      content: 'Something went wrong, please try again!',
    });
  }

  const cardMatch = cards.find(entry => entry.uuid === cardUUID);

  if (!cardMatch) {
    return interaction.reply({
      content: 'I was unable to find any cards matching your request.',
    });
  }

  const editionMatch = cardMatch.editions.find(entry => entry.uuid === editionUUID);

  if (!editionMatch) {
    return interaction.reply({
      content: 'I was unable to find any cards matching your request.',
    });
  }

  const circulationMatch = [...editionMatch.circulationTemplates, ...editionMatch.circulations].find(entry => entry.uuid === circulationUUID);

  if (!circulationMatch) {
    return interaction.reply({
      content: 'I was unable to find any cards matching your request.',
    });
  }
  
  return interaction.reply({
    embeds: [indexEmbed(cardMatch, editionMatch, circulationMatch)],
    content: `<@${interaction.member.user.id}> here you go <:wow_silvie:918934079435583519>`,
  });
}