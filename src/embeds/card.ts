import { ColorResolvable, MessageEmbed } from "discord.js";
import { CardElement } from "../data/types";
import { CardEmbed } from "./types";

const getEmbedColorFromElement: (element: CardElement) => ColorResolvable = (element) => {
  switch (element) {
    case CardElement.Arcane:
      return '#19ABC9';
    
    case CardElement.Crux:
      return '#C28FDD';

    case CardElement.Fire:
      return '#E3462A';

    case CardElement.Normal:
    default:
      return '#111111';

    case CardElement.Water:
      return '#5FD0F8';

    case CardElement.Wind:
      return '#117C00';
  }
}

const cardEmbed: CardEmbed = (card, set) => {
  const embed = new MessageEmbed()
    .setTitle(`${card.name}`)
    .setDescription(`This is ${card.number ?? 'an unnumbered card'} in the ${set.year} ${set.name} set.`)
    .setColor(getEmbedColorFromElement(card.element));

  embed.addField('Cost', `${card.cost} ${card.costType}`, true);
  embed.addField('Element', card.element, true);
  embed.addField('Speed', card.speed ?? '-', true);

  embed.addField('Type', card.type, true);
  embed.addField('Supertype', card.supertype ?? '-', true);
  embed.addField('Subtype', card.subtype ?? '-', true);

  if (card.stats) {
    // @ts-ignore
    embed.addField('Attack', `${card.stats?.attack ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Durability', `${card.stats?.durability ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Health', `${card.stats?.health ?? '-'}`, true);
  }

  if (card.level !== undefined || card.lineage) {
    embed.addField('Level', `${card.level ?? '-'}`, true);
    embed.addField('Lineage', card.lineage ?? '-', true);
    embed.addField('\u200B', '\u200B', true);
  }


  if (card.notes) {
    if (typeof card.notes === 'string') {
      embed.addField('Notes', card.notes);
    } else if (Array.isArray(card.notes) && card.notes.length) {
      embed.addField('Notes', card.notes.join('\n'));
    }
  }

  return embed;
}

export default cardEmbed;